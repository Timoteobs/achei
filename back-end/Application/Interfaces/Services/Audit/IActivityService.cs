namespace Application.Interfaces.Services.Audit;

public interface IActivityService
{
    Task LogAsync(long spaceId, long userId, string action, string entityType, long? entityId = null, object? metadata = null, CancellationToken cancellationToken = default);
}
