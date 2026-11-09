using Domain.Modules.Inventory.Entities;

namespace Application.Interfaces.Repositories;

public interface IItemRepository
{
    Task<bool> IsCategoryAvailableAsync(long categoryId, long spaceId, CancellationToken cancellationToken = default);
    Task AddAsync(Item item, CancellationToken cancellationToken = default);
}
