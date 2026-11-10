using Application.Models.Items;
using Domain.Modules.Inventory.Entities;

namespace Application.Interfaces.Repositories;

public interface IItemRepository
{
    Task<ItemsPageResponse> ListBySpaceAsync(long spaceId, ListItemsRequest request, CancellationToken cancellationToken = default);
    Task<bool> IsCategoryAvailableAsync(long categoryId, long spaceId, CancellationToken cancellationToken = default);
    Task<Item?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default);
    Task UpdateAsync(Item item, CancellationToken cancellationToken = default);
    Task DeleteAsync(Item item, CancellationToken cancellationToken = default);
    Task AddAsync(Item item, CancellationToken cancellationToken = default);
}
