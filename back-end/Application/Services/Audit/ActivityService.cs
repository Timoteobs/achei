using System.Text.Json;
using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services.Audit;
using Application.Models.Activities;
using Domain.Modules.Audit;
using Domain.Modules.Audit.Entities;

namespace Application.Services.Audit;

public sealed class ActivityService(IActivityRepository activities, ISpaceRepository spaces) : IActivityService
{
    #region Service Methods

    public async Task<ActivitiesPageResponse> ListAsync(long spaceId, long userId, ListActivitiesRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);

        var result = await activities.ListBySpaceAsync(spaceId, request.Page, request.PageSize, cancellationToken);
        var totalPages = (int)Math.Ceiling(result.TotalCount / (double)request.PageSize);
        var response = result.Items.Select(ToResponse).ToArray();
        return new ActivitiesPageResponse(response, request.Page, request.PageSize, result.TotalCount, totalPages);
    }

    public async Task<ActivityIndicatorsResponse> GetIndicatorsAsync(long spaceId, long userId, GetActivityIndicatorsRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);

        var periodEnd = request.PeriodEnd?.UtcDateTime ?? DateTime.UtcNow;
        var periodStart = request.PeriodStart?.UtcDateTime ?? periodEnd.AddDays(-30);
        var counts = await activities.CountByActionAndEntityTypeAsync(spaceId, periodStart, periodEnd, cancellationToken);
        return ToResponse(spaceId, counts, periodStart, periodEnd);
    }

    public async Task LogAsync(long spaceId, long userId, string action, string entityType, long? entityId = null, object? metadata = null, CancellationToken cancellationToken = default)
    {
        var activity = new Activity(spaceId, action, entityType, userId, entityId, SerializeMetadata(metadata));
        await activities.AddAsync(activity, cancellationToken);
    }

    #endregion

    #region Helper Methods

    private static ActivityResponse ToResponse(Activity activity)
    {
        return new ActivityResponse(activity.Id, activity.SpaceId, activity.UserId, activity.Action, activity.EntityType, activity.EntityId, activity.Metadata, DateTime.SpecifyKind(activity.CreatedAt, DateTimeKind.Utc));
    }

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
            counts.GetValueOrDefault((ActivityActions.Updated, ActivityEntityTypes.Item)),
            counts.GetValueOrDefault((ActivityActions.Deleted, ActivityEntityTypes.Item)));
    }

    private async Task EnsureOwnedSpaceAsync(long spaceId, long userId, CancellationToken cancellationToken)
    {
        if (await spaces.GetByIdAndOwnerAsync(spaceId, userId, cancellationToken) is null)
        {
            throw SpacesExceptions.SpaceNotFound();
        }
    }

    private static string? SerializeMetadata(object? metadata)
    {
        return metadata is null ? null : JsonSerializer.Serialize(metadata, JsonSerializerOptions.Web);
    }

    #endregion
}
