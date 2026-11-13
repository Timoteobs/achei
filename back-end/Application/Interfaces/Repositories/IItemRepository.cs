using Application.Common;
using Application.Models.Items;
using Domain.Modules.Inventory.Entities;

namespace Application.Interfaces.Repositories;

public interface IItemRepository
{
    Task<IReadOnlyList<Item>> ListByIdsAndSpaceAsync(IReadOnlyCollection<long> ids, long spaceId, CancellationToken cancellationToken = default);
    Task<PagedResult<Item>> ListBySpaceAsync(long spaceId, ItemListQuery query, CancellationToken cancellationToken = default);
    Task<IReadOnlyDictionary<long, int>> CountByLocationIdsAsync(IReadOnlyCollection<long> locationIds, CancellationToken cancellationToken = default);
    Task<bool> IsCategoryAvailableAsync(long categoryId, long spaceId, CancellationToken cancellationToken = default);
    Task<Item?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default);
    Task UpdateAsync(Item item, CancellationToken cancellationToken = default);
    Task DeleteAsync(Item item, CancellationToken cancellationToken = default);
    Task AddAsync(Item item, CancellationToken cancellationToken = default);
}
