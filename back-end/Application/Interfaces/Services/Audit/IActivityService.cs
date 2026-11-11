using Application.Models.Activities;

namespace Application.Interfaces.Services.Audit;

public interface IActivityService
{
    Task<ActivitiesPageResponse> ListAsync(long spaceId, long userId, ListActivitiesRequest request, CancellationToken cancellationToken = default);
    Task<ActivityIndicatorsResponse> GetIndicatorsAsync(long spaceId, long userId, GetActivityIndicatorsRequest request, CancellationToken cancellationToken = default);
    Task LogAsync(long spaceId, long userId, string action, string entityType, long? entityId = null, object? metadata = null, CancellationToken cancellationToken = default);
}
