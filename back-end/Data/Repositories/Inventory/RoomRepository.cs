using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Inventory;
using Domain.Modules.Inventory.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Inventory;

public sealed class RoomRepository(AcheiContext context) : IRoomRepository
{
    private IQueryable<Location> Rooms(long spaceId)
    {
        return context.Locations.Where(location => location.SpaceId == spaceId && location.Type == LocationTypes.Room && location.ParentLocationId == null);
    }

    public async Task<IReadOnlyList<Location>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default)
    {
        return await Rooms(spaceId).AsNoTracking().OrderBy(room => room.Position).ThenBy(room => room.Name).ThenBy(room => room.Id).ToListAsync(cancellationToken);
    }

    public Task<Location?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default)
    {
        return Rooms(spaceId).SingleOrDefaultAsync(room => room.Id == id, cancellationToken);
    }

    public async Task AddAsync(Location room, CancellationToken cancellationToken = default)
    {
        await context.Locations.AddAsync(room, cancellationToken);
        await SaveRoomAsync(cancellationToken);
    }

    public async Task UpdateAsync(Location room, CancellationToken cancellationToken = default)
    {
        context.Locations.Update(room);
        await SaveRoomAsync(cancellationToken);
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
            throw InventoryExceptions.RoomHasDependencies(exception);
        }
    }

    private async Task SaveRoomAsync(CancellationToken cancellationToken)
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
            throw InventoryExceptions.RoomNotFound(exception);
        }
    }
}
