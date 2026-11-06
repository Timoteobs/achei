using Domain.Modules.Spaces.Entities;

namespace Application.Interfaces.Repositories;

public interface ISpaceRepository
{
    Task<IReadOnlyList<Space>> ListByOwnerAsync(long ownerUserId, CancellationToken cancellationToken = default);
    Task<Space?> GetByIdAndOwnerAsync(long id, long ownerUserId, CancellationToken cancellationToken = default);
    Task AddAsync(Space space, CancellationToken cancellationToken = default);
    Task UpdateAsync(Space space, CancellationToken cancellationToken = default);
    Task DeleteAsync(Space space, CancellationToken cancellationToken = default);
}
