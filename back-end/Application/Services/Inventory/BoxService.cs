using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services.Inventory;
using Application.Models.Boxes;
using Domain.Modules.Inventory;
using Domain.Modules.Inventory.Entities;

namespace Application.Services.Inventory;

public sealed class BoxService(IBoxRepository boxes, IRoomRepository rooms, IItemRepository items, ISpaceRepository spaces) : IBoxService
{
    #region Service Methods

    public async Task<IReadOnlyList<BoxResponse>> ListAsync(long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var result = await boxes.ListBySpaceAsync(spaceId, cancellationToken);
        var roomById = (await rooms.ListBySpaceAsync(spaceId, cancellationToken)).ToDictionary(room => room.Id);
        var counts = await items.CountByLocationIdsAsync(result.Select(box => box.Id).ToArray(), cancellationToken);
        var response = new List<BoxResponse>(result.Count);

        foreach (var box in result)
        {
            if (box.ParentLocationId is not long roomId || !roomById.TryGetValue(roomId, out var room))
            {
                throw InventoryExceptions.RoomNotFound();
            }

            response.Add(ToResponse(box, room, counts.GetValueOrDefault(box.Id)));
        }

        return response;
    }

    public async Task<BoxResponse> CreateAsync(long spaceId, long userId, CreateBoxRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var room = await rooms.GetByIdAndSpaceAsync(request.RoomId, spaceId, cancellationToken) ?? throw InventoryExceptions.RoomNotFound();

        var box = new Location(spaceId, request.Name, LocationTypes.Box, parentLocationId: room.Id, createdByUserId: userId, description: request.Description);
        await boxes.AddAsync(box, cancellationToken);

        return ToResponse(box, room, 0);
    }

    public async Task<BoxResponse> GetByIdAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        return await GetResponseAsync(id, spaceId, cancellationToken);
    }

    public async Task<BoxResponse> UpdateAsync(long id, long spaceId, long userId, UpdateBoxRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var box = await GetBoxAsync(id, spaceId, cancellationToken);
        var room = await rooms.GetByIdAndSpaceAsync(request.RoomId, spaceId, cancellationToken) ?? throw InventoryExceptions.RoomNotFound();

        box.UpdateBoxDetails(request.Name, request.Description, room.Id);
        await boxes.UpdateAsync(box, cancellationToken);
        return ToResponse(box, room, await GetItemsCountAsync(box.Id, cancellationToken));
    }

    public async Task DeleteAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var box = await GetBoxAsync(id, spaceId, cancellationToken);
        await boxes.DeleteAsync(box, cancellationToken);
    }

    #endregion

    #region Helper Methods

    private async Task<Location> GetBoxAsync(long id, long spaceId, CancellationToken cancellationToken)
    {
        return await boxes.GetByIdAndSpaceAsync(id, spaceId, cancellationToken) ?? throw InventoryExceptions.BoxNotFound();
    }

    private async Task<BoxResponse> GetResponseAsync(long id, long spaceId, CancellationToken cancellationToken)
    {
        var box = await GetBoxAsync(id, spaceId, cancellationToken);
        var roomId = box.ParentLocationId ?? throw InventoryExceptions.RoomNotFound();
        var room = await rooms.GetByIdAndSpaceAsync(roomId, spaceId, cancellationToken) ?? throw InventoryExceptions.RoomNotFound();
        return ToResponse(box, room, await GetItemsCountAsync(box.Id, cancellationToken));
    }

    private async Task<int> GetItemsCountAsync(long boxId, CancellationToken cancellationToken)
    {
        var counts = await items.CountByLocationIdsAsync(new[] { boxId }, cancellationToken);
        return counts.GetValueOrDefault(boxId);
    }

    private static BoxResponse ToResponse(Location box, Location room, int itemsCount)
    {
        return new BoxResponse(box.Id, box.SpaceId, room.Id, room.Name, box.Name, box.Description, itemsCount, DateTime.SpecifyKind(box.CreatedAt, DateTimeKind.Utc), DateTime.SpecifyKind(box.UpdatedAt, DateTimeKind.Utc));
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
