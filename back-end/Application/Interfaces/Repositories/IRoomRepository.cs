using Domain.Modules.Inventory.Entities;

namespace Application.Interfaces.Repositories;

public interface IRoomRepository
{
    Task<IReadOnlyList<Location>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default);
    Task<Location?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default);
    Task AddAsync(Location room, CancellationToken cancellationToken = default);
    Task UpdateAsync(Location room, CancellationToken cancellationToken = default);
    Task DeleteAsync(Location room, CancellationToken cancellationToken = default);
}
