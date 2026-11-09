using Application.Models.Boxes;
using Domain.Modules.Inventory.Entities;

namespace Application.Interfaces.Repositories;

public interface IBoxRepository
{
    Task<IReadOnlyList<BoxResponse>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default);
    Task<BoxResponse?> GetResponseAsync(long id, long spaceId, CancellationToken cancellationToken = default);
    Task<Location?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default);
    Task UpdateAsync(Location box, CancellationToken cancellationToken = default);
    Task DeleteAsync(Location box, CancellationToken cancellationToken = default);
    Task AddAsync(Location box, CancellationToken cancellationToken = default);
}
