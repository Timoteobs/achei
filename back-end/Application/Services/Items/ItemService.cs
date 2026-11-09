using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Models.Items;
using Domain.Modules.Inventory.Entities;

namespace Application.Services.Items;

public sealed class ItemService(
    IItemRepository items,
    IRoomRepository rooms,
    IBoxRepository boxes,
    ISpaceRepository spaces) : IItemService
{
    public async Task<ItemsPageResponse> ListAsync(long spaceId, long userId, ListItemsRequest request, CancellationToken cancellationToken = default)
    {
        if (await spaces.GetByIdAndOwnerAsync(spaceId, userId, cancellationToken) is null)
            throw new SpaceNotFoundException();

        return await items.ListBySpaceAsync(spaceId, request, cancellationToken);
    }

    public async Task<ItemResponse> CreateAsync(long spaceId, long userId, CreateItemRequest request, CancellationToken cancellationToken = default)
    {
        if (await spaces.GetByIdAndOwnerAsync(spaceId, userId, cancellationToken) is null)
            throw new SpaceNotFoundException();

        var location = await rooms.GetByIdAndSpaceAsync(request.LocationId, spaceId, cancellationToken)
            ?? await boxes.GetByIdAndSpaceAsync(request.LocationId, spaceId, cancellationToken)
            ?? throw new ItemReferenceNotFoundException();

        if (request.CategoryId is long categoryId &&
            !await items.IsCategoryAvailableAsync(categoryId, spaceId, cancellationToken))
            throw new ItemReferenceNotFoundException();

        var item = new Item(location.Id, request.Name,
            categoryId: request.CategoryId, createdByUserId: userId,
            description: request.Description, quantity: request.Quantity, notes: request.Notes);
        await items.AddAsync(item, cancellationToken);

        return new ItemResponse(item.Id, spaceId, item.LocationId, item.CategoryId, item.CreatedByUserId,
            item.Name, item.Description, item.Quantity, item.Notes,
            DateTime.SpecifyKind(item.CreatedAt, DateTimeKind.Utc),
            DateTime.SpecifyKind(item.UpdatedAt, DateTimeKind.Utc));
    }
}
