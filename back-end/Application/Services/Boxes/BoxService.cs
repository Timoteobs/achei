using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Models.Boxes;
using Domain.Modules.Inventory;
using Domain.Modules.Inventory.Entities;

namespace Application.Services.Boxes;

public sealed class BoxService(IBoxRepository boxes, IRoomRepository rooms, ISpaceRepository spaces) : IBoxService
{
    public async Task<IReadOnlyList<BoxResponse>> ListAsync(long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        return await boxes.ListBySpaceAsync(spaceId, cancellationToken);
    }

    public async Task<BoxResponse> CreateAsync(long spaceId, long userId, CreateBoxRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var room = await rooms.GetByIdAndSpaceAsync(request.RoomId, spaceId, cancellationToken)
            ?? throw new RoomNotFoundException();

        var box = new Location(spaceId, request.Name, LocationTypes.Box,
            parentLocationId: room.Id, createdByUserId: userId, description: request.Description);
        await boxes.AddAsync(box, cancellationToken);
        return new BoxResponse(box.Id, box.SpaceId, room.Id, room.Name, box.Name, box.Description, 0,
            DateTime.SpecifyKind(box.CreatedAt, DateTimeKind.Utc),
            DateTime.SpecifyKind(box.UpdatedAt, DateTimeKind.Utc));
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
        var room = await rooms.GetByIdAndSpaceAsync(request.RoomId, spaceId, cancellationToken)
            ?? throw new RoomNotFoundException();

        box.UpdateBoxDetails(request.Name, request.Description, room.Id);
        await boxes.UpdateAsync(box, cancellationToken);
        return await GetResponseAsync(id, spaceId, cancellationToken);
    }

    public async Task DeleteAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var box = await GetBoxAsync(id, spaceId, cancellationToken);
        await boxes.DeleteAsync(box, cancellationToken);
    }

    private async Task<Location> GetBoxAsync(long id, long spaceId, CancellationToken cancellationToken) =>
        await boxes.GetByIdAndSpaceAsync(id, spaceId, cancellationToken) ?? throw new BoxNotFoundException();

    private async Task<BoxResponse> GetResponseAsync(long id, long spaceId, CancellationToken cancellationToken) =>
        await boxes.GetResponseAsync(id, spaceId, cancellationToken) ?? throw new BoxNotFoundException();

    private async Task EnsureOwnedSpaceAsync(long spaceId, long userId, CancellationToken cancellationToken)
    {
        if (await spaces.GetByIdAndOwnerAsync(spaceId, userId, cancellationToken) is null)
            throw new SpaceNotFoundException();
    }
}
