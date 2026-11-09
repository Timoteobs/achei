using Application.Models.Items;

namespace Application.Interfaces.Services;

public interface IItemService
{
    Task<ItemResponse> CreateAsync(long spaceId, long userId, CreateItemRequest request, CancellationToken cancellationToken = default);
}
