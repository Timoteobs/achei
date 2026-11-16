using Domain.Modules.Spaces.Entities;

namespace Application.Interfaces.Repositories;

public interface IInvitationRepository
{
    Task<IReadOnlyList<Invitation>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default);
    Task<Invitation?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default);
    Task AddAsync(Invitation invitation, CancellationToken cancellationToken = default);
    Task UpdateAsync(Invitation invitation, CancellationToken cancellationToken = default);
    Task DeleteAsync(Invitation invitation, CancellationToken cancellationToken = default);
}
