using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Models.Rooms;
using Data.Context;
using Domain.Modules.Inventory;
using Domain.Modules.Inventory.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Inventory;

public sealed class RoomRepository(AcheiContext context) : IRoomRepository
{
    private IQueryable<Location> Rooms(long spaceId) =>
        context.Locations.Where(location =>
            location.SpaceId == spaceId &&
            location.Type == LocationTypes.Room &&
            location.ParentLocationId == null);

    // Count boxes in SQL together with the rooms, without a query per room.
    private IQueryable<RoomResponse> WithBoxesCount(IQueryable<Location> rooms) =>
        rooms.Select(room => new RoomResponse(
            room.Id,
            room.SpaceId,
            room.Name,
            room.Description,
            room.Icon,
            room.Color,
            context.Locations.Count(box =>
                box.SpaceId == room.SpaceId &&
                box.ParentLocationId == room.Id &&
                box.Type == LocationTypes.Box),
            DateTime.SpecifyKind(room.CreatedAt, DateTimeKind.Utc),
            DateTime.SpecifyKind(room.UpdatedAt, DateTimeKind.Utc)));

    public async Task<IReadOnlyList<RoomResponse>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default) =>
        await WithBoxesCount(Rooms(spaceId).AsNoTracking()
            .OrderBy(room => room.Position)
            .ThenBy(room => room.Name)
            .ThenBy(room => room.Id))
            .ToListAsync(cancellationToken);

    public Task<RoomResponse?> GetResponseAsync(long id, long spaceId, CancellationToken cancellationToken = default) =>
        WithBoxesCount(Rooms(spaceId).AsNoTracking().Where(room => room.Id == id))
            .SingleOrDefaultAsync(cancellationToken);

    public Task<Location?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default) =>
        Rooms(spaceId).SingleOrDefaultAsync(room => room.Id == id, cancellationToken);

    public async Task AddAsync(Location room, CancellationToken cancellationToken = default)
    {
        await context.Locations.AddAsync(room, cancellationToken);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Location room, CancellationToken cancellationToken = default)
    {
        context.Locations.Update(room);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Location room, CancellationToken cancellationToken = default)
    {
        context.Locations.Remove(room);
        try
        {
            await SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 547 })
        {
            throw new RoomHasDependenciesException(exception);
        }
    }

    private async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException)
        {
            throw new RoomNotFoundException();
        }
    }
}
