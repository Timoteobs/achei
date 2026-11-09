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
    public async Task<ItemsPageResponse> ListBySpaceAsync(long spaceId, ListItemsRequest request, CancellationToken cancellationToken = default)
    {
        var query = from item in context.Items.AsNoTracking()
                    join location in context.Locations.AsNoTracking() on item.LocationId equals location.Id
                    where location.SpaceId == spaceId
                    select item;

        if (request.LocationId is long locationId)
            query = query.Where(item => item.LocationId == locationId);

        var search = request.Search?.Trim();
        if (!string.IsNullOrEmpty(search))
            query = query.Where(item => item.Name.Contains(search));

        var totalCount = await query.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);
        var offset = ((long)request.Page - 1) * request.PageSize;
        // Out-of-range pages are empty; use long arithmetic before converting to Skip's int.
        if (offset >= totalCount)
            return new ItemsPageResponse(Array.Empty<ItemResponse>(), request.Page, request.PageSize, totalCount, totalPages);

        var orderedQuery = request.Sort switch
        {
            "recent" => query.OrderByDescending(item => item.CreatedAt).ThenByDescending(item => item.Id),
            "oldest" => query.OrderBy(item => item.CreatedAt).ThenBy(item => item.Id),
            "name-asc" => query.OrderBy(item => item.Name).ThenBy(item => item.Id),
            "name-desc" => query.OrderByDescending(item => item.Name).ThenByDescending(item => item.Id),
            _ => throw new ArgumentException("Ordenação inválida.")
        };

        var items = await orderedQuery.Skip((int)offset).Take(request.PageSize)
            .Select(item => new ItemResponse(
                item.Id, spaceId, item.LocationId, item.CategoryId, item.CreatedByUserId,
                item.Name, item.Description, item.Quantity, item.Notes,
                DateTime.SpecifyKind(item.CreatedAt, DateTimeKind.Utc),
                DateTime.SpecifyKind(item.UpdatedAt, DateTimeKind.Utc)))
            .ToListAsync(cancellationToken);

        return new ItemsPageResponse(items, request.Page, request.PageSize, totalCount, totalPages);
    }

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
