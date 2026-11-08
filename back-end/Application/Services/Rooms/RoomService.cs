using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Models.Rooms;
using Domain.Modules.Inventory;
using Domain.Modules.Inventory.Entities;

namespace Application.Services.Rooms;

public sealed class RoomService(IRoomRepository rooms, ISpaceRepository spaces) : IRoomService
{
    public async Task<IReadOnlyList<RoomResponse>> ListAsync(long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        return await rooms.ListBySpaceAsync(spaceId, cancellationToken);
    }

    public async Task<RoomResponse> GetByIdAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        return await GetResponseAsync(id, spaceId, cancellationToken);
    }

    public async Task<RoomResponse> CreateAsync(long spaceId, long userId, SaveRoomRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var room = new Location(spaceId, request.Name, LocationTypes.Room,
            createdByUserId: userId, description: request.Description, icon: request.Icon, color: request.Color);
        await rooms.AddAsync(room, cancellationToken);
        return await GetResponseAsync(room.Id, spaceId, cancellationToken);
    }

    public async Task<RoomResponse> UpdateAsync(long id, long spaceId, long userId, SaveRoomRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var room = await GetRoomAsync(id, spaceId, cancellationToken);
        room.UpdateDetails(request.Name, request.Description, request.Icon, request.Color);
        await rooms.UpdateAsync(room, cancellationToken);
        return await GetResponseAsync(id, spaceId, cancellationToken);
    }

    public async Task DeleteAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var room = await GetRoomAsync(id, spaceId, cancellationToken);
        await rooms.DeleteAsync(room, cancellationToken);
    }

    private async Task EnsureOwnedSpaceAsync(long spaceId, long userId, CancellationToken cancellationToken)
    {
        if (await spaces.GetByIdAndOwnerAsync(spaceId, userId, cancellationToken) is null)
            throw new SpaceNotFoundException();
    }

    private async Task<Location> GetRoomAsync(long id, long spaceId, CancellationToken cancellationToken) =>
        await rooms.GetByIdAndSpaceAsync(id, spaceId, cancellationToken) ?? throw new RoomNotFoundException();

    private async Task<RoomResponse> GetResponseAsync(long id, long spaceId, CancellationToken cancellationToken) =>
        await rooms.GetResponseAsync(id, spaceId, cancellationToken) ?? throw new RoomNotFoundException();
}
