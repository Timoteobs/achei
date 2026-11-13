using Domain.Modules.Inventory.Entities;

namespace Application.Interfaces.Repositories;

public interface IBoxRepository
{
    Task<IReadOnlyList<Location>> ListByIdsAndSpaceAsync(IReadOnlyCollection<long> ids, long spaceId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Location>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default);
    Task<IReadOnlyDictionary<long, int>> CountByRoomIdsAsync(IReadOnlyCollection<long> roomIds, CancellationToken cancellationToken = default);
    Task<Location?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default);
    Task UpdateAsync(Location box, CancellationToken cancellationToken = default);
    Task DeleteAsync(Location box, CancellationToken cancellationToken = default);
    Task AddAsync(Location box, CancellationToken cancellationToken = default);
}
