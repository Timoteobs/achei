using Application.Common;
using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Models.Items;
using Data.Context;
using Domain.Modules.Inventory.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Inventory;

public sealed class ItemRepository(AcheiContext context) : IItemRepository
{
    public async Task<IReadOnlyList<Item>> ListByIdsAndSpaceAsync(IReadOnlyCollection<long> ids, long spaceId, CancellationToken cancellationToken = default)
    {
        if (ids.Count == 0)
        {
            return Array.Empty<Item>();
        }

        return await (from item in context.Items.AsNoTracking()
                      join location in context.Locations.AsNoTracking() on item.LocationId equals location.Id
                      where ids.Contains(item.Id) && location.SpaceId == spaceId
                      select item).ToListAsync(cancellationToken);
    }

    public async Task<PagedResult<Item>> ListBySpaceAsync(long spaceId, ItemListQuery queryParameters, CancellationToken cancellationToken = default)
    {
        var query = from item in context.Items.AsNoTracking()
                    join location in context.Locations.AsNoTracking() on item.LocationId equals location.Id
                    where location.SpaceId == spaceId
                    select item;

        if (queryParameters.LocationId is long locationId)
        {
            query = query.Where(item => item.LocationId == locationId);
        }

        var search = queryParameters.Search?.Trim();
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(item => item.Name.Contains(search));
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var offset = ((long)queryParameters.Page - 1) * queryParameters.PageSize;
        // Páginas fora do intervalo ficam vazias; utiliza long antes da conversão para o Skip.
        if (offset >= totalCount)
        {
            return new PagedResult<Item>(Array.Empty<Item>(), totalCount);
        }

        var orderedQuery = queryParameters.Sort switch
        {
            "recent" => query.OrderByDescending(item => item.CreatedAt).ThenByDescending(item => item.Id),
            "oldest" => query.OrderBy(item => item.CreatedAt).ThenBy(item => item.Id),
            "name-asc" => query.OrderBy(item => item.Name).ThenBy(item => item.Id),
            "name-desc" => query.OrderByDescending(item => item.Name).ThenByDescending(item => item.Id),
            _ => throw new ArgumentException("Ordenação inválida.")
        };

        var result = await orderedQuery.Skip((int)offset).Take(queryParameters.PageSize).ToListAsync(cancellationToken);

        return new PagedResult<Item>(result, totalCount);
    }

    public async Task<IReadOnlyDictionary<long, int>> CountByLocationIdsAsync(IReadOnlyCollection<long> locationIds, CancellationToken cancellationToken = default)
    {
        if (locationIds.Count == 0)
        {
            return new Dictionary<long, int>();
        }

        return await context.Items.AsNoTracking().Where(item => locationIds.Contains(item.LocationId)).GroupBy(item => item.LocationId).ToDictionaryAsync(group => group.Key, group => group.Count(), cancellationToken);
    }

    public Task<bool> IsCategoryAvailableAsync(long categoryId, long spaceId, CancellationToken cancellationToken = default)
    {
        return context.Categories.AnyAsync(category => category.Id == categoryId && (category.SpaceId == null || category.SpaceId == spaceId), cancellationToken);
    }

    public Task<Item?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default)
    {
        return (from item in context.Items
                join location in context.Locations on item.LocationId equals location.Id
                where item.Id == id && location.SpaceId == spaceId
                select item).SingleOrDefaultAsync(cancellationToken);
    }

    public async Task UpdateAsync(Item item, CancellationToken cancellationToken = default)
    {
        context.Items.Update(item);
        await SaveItemAsync(cancellationToken);
    }

    public async Task DeleteAsync(Item item, CancellationToken cancellationToken = default)
    {
        context.Items.Remove(item);
        try
        {
            await SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 547 })
        {
            throw InventoryExceptions.ItemHasDependencies(exception);
        }
    }

    public async Task AddAsync(Item item, CancellationToken cancellationToken = default)
    {
        await context.Items.AddAsync(item, cancellationToken);
        await SaveItemAsync(cancellationToken);
    }

    private async Task SaveItemAsync(CancellationToken cancellationToken)
    {
        try
        {
            await SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 547 })
        {
            throw InventoryExceptions.ReferenceNotFound(exception);
        }
    }

    private async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException exception)
        {
            throw InventoryExceptions.ItemNotFound(exception);
        }
    }
}
