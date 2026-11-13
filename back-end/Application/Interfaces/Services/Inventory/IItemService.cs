using Application.Models.Items;

namespace Application.Interfaces.Services.Inventory;

public interface IItemService
{
    Task<RecentItemsResponse> ListRecentAsync(long spaceId, long userId, ListRecentItemsRequest request, CancellationToken cancellationToken = default);
    Task<ItemsPageResponse> ListAsync(long spaceId, long userId, ListItemsRequest request, CancellationToken cancellationToken = default);
    Task<ItemResponse> GetByIdAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default);
    Task<ItemResponse> CreateAsync(long spaceId, long userId, CreateItemRequest request, CancellationToken cancellationToken = default);
    Task<ItemResponse> UpdateAsync(long id, long spaceId, long userId, UpdateItemRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default);
}
