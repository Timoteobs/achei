using Application.Models.Items;

namespace Application.Interfaces.Services;

public interface IItemService
{
    Task<ItemsPageResponse> ListAsync(long spaceId, long userId, ListItemsRequest request, CancellationToken cancellationToken = default);
    Task<ItemResponse> CreateAsync(long spaceId, long userId, CreateItemRequest request, CancellationToken cancellationToken = default);
}
