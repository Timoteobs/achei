namespace Application.Interfaces.Services.Spaces;

public interface ISpaceAccessService
{
    Task EnsureCanReadAsync(long spaceId, long userId, CancellationToken cancellationToken = default);
    Task EnsureCanEditAsync(long spaceId, long userId, CancellationToken cancellationToken = default);
}
