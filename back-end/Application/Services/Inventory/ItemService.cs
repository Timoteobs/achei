using Application.Common.Exceptions;
using Application.Interfaces.Persistence;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services.Audit;
using Application.Interfaces.Services.Inventory;
using Application.Models.Items;
using Domain.Modules.Audit;
using Domain.Modules.Inventory.Entities;

namespace Application.Services.Inventory;

public sealed class ItemService(IItemRepository items, IRoomRepository rooms, IBoxRepository boxes, ISpaceRepository spaces, IActivityService activities, IUnitOfWork unitOfWork) : IItemService
{
    #region Service Methods

    public async Task<ItemsPageResponse> ListAsync(long spaceId, long userId, ListItemsRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);

        if (request.LocationId is long locationId)
        {
            var location = await rooms.GetByIdAndSpaceAsync(locationId, spaceId, cancellationToken) ?? await boxes.GetByIdAndSpaceAsync(locationId, spaceId, cancellationToken);
            if (location is null)
            {
                throw InventoryExceptions.ItemReferenceNotFound();
            }
        }

        var query = new ItemListQuery(request.Page, request.PageSize, request.Sort, request.LocationId, request.Search);
        var result = await items.ListBySpaceAsync(spaceId, query, cancellationToken);
        var totalPages = (int)Math.Ceiling(result.TotalCount / (double)request.PageSize);
        var response = result.Items.Select(item => ToResponse(item, spaceId)).ToArray();
        return new ItemsPageResponse(response, request.Page, request.PageSize, result.TotalCount, totalPages);
    }

    public async Task<ItemResponse> GetByIdAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var item = await items.GetByIdAndSpaceAsync(id, spaceId, cancellationToken) ?? throw InventoryExceptions.ItemNotFound();
        return ToResponse(item, spaceId);
    }

    public async Task<ItemResponse> CreateAsync(long spaceId, long userId, CreateItemRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);

        var location = await rooms.GetByIdAndSpaceAsync(request.LocationId, spaceId, cancellationToken)
            ?? await boxes.GetByIdAndSpaceAsync(request.LocationId, spaceId, cancellationToken) ?? throw InventoryExceptions.ItemReferenceNotFound();

        if (request.CategoryId is long categoryId && !await items.IsCategoryAvailableAsync(categoryId, spaceId, cancellationToken))
        {
            throw InventoryExceptions.ItemReferenceNotFound();
        }

        var item = new Item(location.Id, request.Name, categoryId: request.CategoryId, createdByUserId: userId, description: request.Description, quantity: request.Quantity, notes: request.Notes);
        await unitOfWork.ExecuteAsync(async transactionCancellationToken =>
        {
            await items.AddAsync(item, transactionCancellationToken);
            await activities.LogAsync(spaceId, userId, ActivityActions.Created, ActivityEntityTypes.Item, item.Id, new { item.Name, item.LocationId, item.CategoryId, item.Quantity }, transactionCancellationToken);
        }, cancellationToken);

        return ToResponse(item, spaceId);
    }

    public async Task<ItemResponse> UpdateAsync(long id, long spaceId, long userId, UpdateItemRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);

        var item = await items.GetByIdAndSpaceAsync(id, spaceId, cancellationToken) ?? throw InventoryExceptions.ItemNotFound();
        var location = await rooms.GetByIdAndSpaceAsync(request.LocationId, spaceId, cancellationToken)
            ?? await boxes.GetByIdAndSpaceAsync(request.LocationId, spaceId, cancellationToken) ?? throw InventoryExceptions.ItemReferenceNotFound();

        if (request.CategoryId is long categoryId && !await items.IsCategoryAvailableAsync(categoryId, spaceId, cancellationToken))
        {
            throw InventoryExceptions.ItemReferenceNotFound();
        }

        item.UpdateDetails(location.Id, request.Name, request.CategoryId, request.Description, request.Quantity, request.Notes);
        await unitOfWork.ExecuteAsync(async transactionCancellationToken =>
        {
            await items.UpdateAsync(item, transactionCancellationToken);
            await activities.LogAsync(spaceId, userId, ActivityActions.Updated, ActivityEntityTypes.Item, item.Id, new { item.Name, item.LocationId, item.CategoryId, item.Quantity }, transactionCancellationToken);
        }, cancellationToken);

        return ToResponse(item, spaceId);
    }

    public async Task DeleteAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);

        var item = await items.GetByIdAndSpaceAsync(id, spaceId, cancellationToken) ?? throw InventoryExceptions.ItemNotFound();
        await unitOfWork.ExecuteAsync(async transactionCancellationToken =>
        {
            await items.DeleteAsync(item, transactionCancellationToken);
            await activities.LogAsync(spaceId, userId, ActivityActions.Deleted, ActivityEntityTypes.Item, item.Id, new { item.Name, item.LocationId, item.CategoryId, item.Quantity }, transactionCancellationToken);
        }, cancellationToken);
    }

    #endregion

    #region Helper Methods

    private static ItemResponse ToResponse(Item item, long spaceId)
    {
        return new ItemResponse(item.Id, spaceId, item.LocationId, item.CategoryId, item.CreatedByUserId, item.Name, item.Description, item.Quantity, item.Notes, DateTime.SpecifyKind(item.CreatedAt, DateTimeKind.Utc), DateTime.SpecifyKind(item.UpdatedAt, DateTimeKind.Utc));
    }

    private async Task EnsureOwnedSpaceAsync(long spaceId, long userId, CancellationToken cancellationToken)
    {
        if (await spaces.GetByIdAndOwnerAsync(spaceId, userId, cancellationToken) is null)
        {
            throw SpacesExceptions.SpaceNotFound();
        }
    }

    #endregion
}
