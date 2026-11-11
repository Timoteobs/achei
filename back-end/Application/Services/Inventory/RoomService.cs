using Application.Common.Exceptions;
using Application.Interfaces.Persistence;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services.Audit;
using Application.Interfaces.Services.Inventory;
using Application.Models.Rooms;
using Domain.Modules.Audit;
using Domain.Modules.Inventory;
using Domain.Modules.Inventory.Entities;

namespace Application.Services.Inventory;

public sealed class RoomService(IRoomRepository rooms, IBoxRepository boxes, ISpaceRepository spaces, IActivityService activities, IUnitOfWork unitOfWork) : IRoomService
{
    #region Service Methods

    public async Task<IReadOnlyList<RoomResponse>> ListAsync(long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var result = await rooms.ListBySpaceAsync(spaceId, cancellationToken);
        var counts = await boxes.CountByRoomIdsAsync(result.Select(room => room.Id).ToArray(), cancellationToken);
        return result.Select(room => ToResponse(room, counts.GetValueOrDefault(room.Id))).ToArray();
    }

    public async Task<RoomResponse> GetByIdAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var room = await GetRoomAsync(id, spaceId, cancellationToken);
        return ToResponse(room, await GetBoxesCountAsync(room.Id, cancellationToken));
    }

    public async Task<RoomResponse> CreateAsync(long spaceId, long userId, SaveRoomRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var room = new Location(spaceId, request.Name, LocationTypes.Room, createdByUserId: userId, description: request.Description, icon: request.Icon, color: request.Color);
        await unitOfWork.ExecuteAsync(async transactionCancellationToken =>
        {
            await rooms.AddAsync(room, transactionCancellationToken);
            await activities.LogAsync(spaceId, userId, ActivityActions.Created, ActivityEntityTypes.Room, room.Id, new { room.Name }, transactionCancellationToken);
        }, cancellationToken);

        return ToResponse(room, 0);
    }

    public async Task<RoomResponse> UpdateAsync(long id, long spaceId, long userId, SaveRoomRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var room = await GetRoomAsync(id, spaceId, cancellationToken);
        room.UpdateDetails(request.Name, request.Description, request.Icon, request.Color);
        await unitOfWork.ExecuteAsync(async transactionCancellationToken =>
        {
            await rooms.UpdateAsync(room, transactionCancellationToken);
            await activities.LogAsync(spaceId, userId, ActivityActions.Updated, ActivityEntityTypes.Room, room.Id, new { room.Name }, transactionCancellationToken);
        }, cancellationToken);

        return ToResponse(room, await GetBoxesCountAsync(room.Id, cancellationToken));
    }

    public async Task DeleteAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var room = await GetRoomAsync(id, spaceId, cancellationToken);
        await unitOfWork.ExecuteAsync(async transactionCancellationToken =>
        {
            await rooms.DeleteAsync(room, transactionCancellationToken);
            await activities.LogAsync(spaceId, userId, ActivityActions.Deleted, ActivityEntityTypes.Room, room.Id, new { room.Name }, transactionCancellationToken);
        }, cancellationToken);
    }

    #endregion

    #region Helper Methods

    private async Task EnsureOwnedSpaceAsync(long spaceId, long userId, CancellationToken cancellationToken)
    {
        if (await spaces.GetByIdAndOwnerAsync(spaceId, userId, cancellationToken) is null)
        {
            throw SpacesExceptions.SpaceNotFound();
        }
    }

    private async Task<Location> GetRoomAsync(long id, long spaceId, CancellationToken cancellationToken)
    {
        return await rooms.GetByIdAndSpaceAsync(id, spaceId, cancellationToken) ?? throw InventoryExceptions.RoomNotFound();
    }

    private async Task<int> GetBoxesCountAsync(long roomId, CancellationToken cancellationToken)
    {
        var counts = await boxes.CountByRoomIdsAsync(new[] { roomId }, cancellationToken);
        return counts.GetValueOrDefault(roomId);
    }

    private static RoomResponse ToResponse(Location room, int boxesCount)
    {
        return new RoomResponse(room.Id, room.SpaceId, room.Name, room.Description, room.Icon, room.Color, boxesCount, DateTime.SpecifyKind(room.CreatedAt, DateTimeKind.Utc), DateTime.SpecifyKind(room.UpdatedAt, DateTimeKind.Utc));
    }

    #endregion
}
