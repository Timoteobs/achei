using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Inventory.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Inventory;

public sealed class ItemRepository(AcheiContext context) : IItemRepository
{
    public Task<bool> IsCategoryAvailableAsync(long categoryId, long spaceId, CancellationToken cancellationToken = default) =>
        context.Categories.AnyAsync(category => category.Id == categoryId &&
            (category.SpaceId == null || category.SpaceId == spaceId), cancellationToken);

    public async Task AddAsync(Item item, CancellationToken cancellationToken = default)
    {
        await context.Items.AddAsync(item, cancellationToken);
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 547 })
        {
            // A referenced record may have been removed after validation.
            throw new ItemReferenceNotFoundException();
        }
    }
}
