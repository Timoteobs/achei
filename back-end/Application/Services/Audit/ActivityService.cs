using System.Text.Json;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services.Audit;
using Domain.Modules.Audit.Entities;

namespace Application.Services.Audit;

public sealed class ActivityService(IActivityRepository activities) : IActivityService
{
    #region Service Methods

    public async Task LogAsync(long spaceId, long userId, string action, string entityType, long? entityId = null, object? metadata = null, CancellationToken cancellationToken = default)
    {
        var activity = new Activity(spaceId, action, entityType, userId, entityId, SerializeMetadata(metadata));
        await activities.AddAsync(activity, cancellationToken);
    }

    #endregion

    #region Helper Methods

    private static string? SerializeMetadata(object? metadata)
    {
        return metadata is null ? null : JsonSerializer.Serialize(metadata, JsonSerializerOptions.Web);
    }

    #endregion
}
