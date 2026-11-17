using System.Text.Json;
using System.Text.Json.Nodes;
using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services.Audit;
using Application.Interfaces.Services.Spaces;
using Application.Models.Activities;
using Domain.Modules.Audit;
using Domain.Modules.Audit.Entities;
using Domain.Modules.Identity.Entities;

namespace Application.Services.Audit;

public sealed class ActivityService(IActivityRepository activities, ISpaceAccessService access, IUserRepository users, IRoomRepository rooms, IBoxRepository boxes) : IActivityService
{
    #region Service Methods

    public async Task<ActivitiesPageResponse> ListAsync(long spaceId, long userId, ListActivitiesRequest request, CancellationToken cancellationToken = default)
    {
        await access.EnsureCanReadAsync(spaceId, userId, cancellationToken);

        var result = await activities.ListBySpaceAsync(spaceId, request.Page, request.PageSize, cancellationToken);
        var totalPages = (int)Math.Ceiling(result.TotalCount / (double)request.PageSize);
        var authorIds = result.Items.Where(activity => activity.UserId.HasValue).Select(activity => activity.UserId!.Value).Distinct().ToArray();
        var authorsById = (await users.ListByIdsAsync(authorIds, cancellationToken)).ToDictionary(author => author.Id);
        var response = result.Items.Select(activity => ToResponse(activity,
            activity.UserId is long authorId ? authorsById.GetValueOrDefault(authorId) : null, userId)).ToArray();
        return new ActivitiesPageResponse(response, request.Page, request.PageSize, result.TotalCount, totalPages);
    }

    public async Task<ActivityIndicatorsResponse> GetIndicatorsAsync(long spaceId, long userId, GetActivityIndicatorsRequest request, CancellationToken cancellationToken = default)
    {
        await access.EnsureCanReadAsync(spaceId, userId, cancellationToken);

        var periodEnd = request.PeriodEnd?.UtcDateTime ?? DateTime.UtcNow;
        var periodStart = request.PeriodStart?.UtcDateTime ?? periodEnd.AddDays(-30);
        var counts = await activities.CountByActionAndEntityTypeAsync(spaceId, periodStart, periodEnd, cancellationToken);
        return ToResponse(spaceId, counts, periodStart, periodEnd);
    }

    public async Task LogAsync(long spaceId, long userId, string action, string entityType, long? entityId = null, object? metadata = null, CancellationToken cancellationToken = default)
    {
        var snapshot = JsonSerializer.SerializeToNode(metadata, JsonSerializerOptions.Web) as JsonObject;
        if (snapshot is not null)
        {
            var locationId = snapshot["locationId"]?.GetValue<long>() ?? snapshot["roomId"]?.GetValue<long>();
            var previousLocationId = snapshot["previousLocationId"]?.GetValue<long>() ?? snapshot["previousRoomId"]?.GetValue<long>();
            ActivityLocationResponse? location = null;
            if (locationId.HasValue)
            {
                location = await GetLocationSnapshotAsync(spaceId, locationId.Value, cancellationToken);
            }
            else if (entityType == ActivityEntityTypes.Room && entityId.HasValue && snapshot["name"]?.GetValue<string>() is string roomName)
            {
                location = new ActivityLocationResponse(new ActivityLocationEntryResponse(entityId.Value, roomName), null);
            }

            snapshot["location"] = JsonSerializer.SerializeToNode(location, JsonSerializerOptions.Web);
            if (previousLocationId.HasValue && previousLocationId != locationId)
            {
                var previousLocation = await GetLocationSnapshotAsync(spaceId, previousLocationId.Value, cancellationToken);
                snapshot["previousLocation"] = JsonSerializer.SerializeToNode(previousLocation, JsonSerializerOptions.Web);
            }
        }

        var activity = new Activity(spaceId, action, entityType, userId, entityId, SerializeMetadata(snapshot ?? metadata));
        await activities.AddAsync(activity, cancellationToken);
    }

    #endregion

    #region Helper Methods

    private static ActivityResponse ToResponse(Activity activity, User? author, long currentUserId)
    {
        var metadata = ReadMetadata(activity.Metadata);
        var authorResponse = new ActivityAuthorResponse(author?.Id, author?.Name ?? "Usuário removido", author?.AvatarUrl, author?.Id == currentUserId);
        return new ActivityResponse(
            activity.Id, activity.SpaceId, activity.UserId, activity.Action, activity.EntityType, activity.EntityId,
            activity.Metadata, DateTime.SpecifyKind(activity.CreatedAt, DateTimeKind.Utc),
            authorResponse, metadata?.Name, metadata?.Location, metadata?.PreviousLocation);
    }

    private async Task<ActivityLocationResponse?> GetLocationSnapshotAsync(long spaceId, long locationId, CancellationToken cancellationToken)
    {
        var room = await rooms.GetByIdAndSpaceAsync(locationId, spaceId, cancellationToken);
        if (room is not null)
        {
            return new ActivityLocationResponse(new ActivityLocationEntryResponse(room.Id, room.Name), null);
        }

        var box = await boxes.GetByIdAndSpaceAsync(locationId, spaceId, cancellationToken);
        if (box?.ParentLocationId is not long roomId)
        {
            return null;
        }

        room = await rooms.GetByIdAndSpaceAsync(roomId, spaceId, cancellationToken);
        if (room is null)
        {
            return null;
        }

        return new ActivityLocationResponse(new ActivityLocationEntryResponse(room.Id, room.Name), new ActivityLocationEntryResponse(box.Id, box.Name));
    }

    private static ActivityMetadata? ReadMetadata(string? metadata)
    {
        if (string.IsNullOrWhiteSpace(metadata))
        {
            return null;
        }

        try
        {
            return JsonSerializer.Deserialize<ActivityMetadata>(metadata, JsonSerializerOptions.Web);
        }
        catch (JsonException)
        {
            // Registros antigos com metadados inválidos continuam visíveis no histórico.
            return null;
        }
    }

    private sealed record ActivityMetadata(string? Name, ActivityLocationResponse? Location, ActivityLocationResponse? PreviousLocation);

    private static ActivityIndicatorsResponse ToResponse(
        long spaceId,
        IReadOnlyDictionary<(string Action, string EntityType), int> counts,
        DateTime periodStart,
        DateTime periodEnd)
    {
        return new ActivityIndicatorsResponse(
            spaceId,
            periodStart,
            periodEnd,
            counts.Values.Sum(),
            counts.GetValueOrDefault((ActivityActions.Created, ActivityEntityTypes.Item)),
            counts.GetValueOrDefault((ActivityActions.Updated, ActivityEntityTypes.Item)) + counts.GetValueOrDefault((ActivityActions.Moved, ActivityEntityTypes.Item)),
            counts.GetValueOrDefault((ActivityActions.Deleted, ActivityEntityTypes.Item)));
    }

    private static string? SerializeMetadata(object? metadata)
    {
        return metadata is null ? null : JsonSerializer.Serialize(metadata, JsonSerializerOptions.Web);
    }

    #endregion
}
