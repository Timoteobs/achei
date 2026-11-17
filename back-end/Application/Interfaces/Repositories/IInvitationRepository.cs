using Domain.Modules.Spaces.Entities;

namespace Application.Interfaces.Repositories;

public interface IInvitationRepository
{
    Task<IReadOnlyList<Invitation>> ListByRecipientAsync(long userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Invitation>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default);
    Task<Invitation?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default);
    Task<Invitation?> GetByIdAndRecipientAsync(long id, long userId, CancellationToken cancellationToken = default);
    Task<bool> TryRespondAsync(Invitation invitation, long userId, CancellationToken cancellationToken = default);
    Task<bool> TryRevokeAsync(Invitation invitation, CancellationToken cancellationToken = default);
    Task AddAsync(Invitation invitation, CancellationToken cancellationToken = default);
    Task UpdateAsync(Invitation invitation, CancellationToken cancellationToken = default);
    Task DeleteAsync(Invitation invitation, CancellationToken cancellationToken = default);
}
