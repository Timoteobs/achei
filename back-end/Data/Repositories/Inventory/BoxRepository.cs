using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Inventory;
using Domain.Modules.Inventory.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Inventory;

public sealed class BoxRepository(AcheiContext context) : IBoxRepository
{
    private IQueryable<Location> Boxes(long spaceId)
    {
        return from box in context.Locations
               join room in context.Locations on box.ParentLocationId equals (long?)room.Id
               where box.SpaceId == spaceId && box.Type == LocationTypes.Box &&
               room.SpaceId == spaceId && room.Type == LocationTypes.Room && room.ParentLocationId == null
               select box;
    }

    public async Task<IReadOnlyList<Location>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default)
    {
        return await Boxes(spaceId).AsNoTracking().OrderByDescending(box => box.CreatedAt).ThenByDescending(box => box.Id).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyDictionary<long, int>> CountByRoomIdsAsync(IReadOnlyCollection<long> roomIds, CancellationToken cancellationToken = default)
    {
        if (roomIds.Count == 0)
        {
            return new Dictionary<long, int>();
        }

        return await context.Locations.AsNoTracking().Where(box => box.Type == LocationTypes.Box && box.ParentLocationId.HasValue && roomIds.Contains(box.ParentLocationId.Value)).GroupBy(box => box.ParentLocationId!.Value).ToDictionaryAsync(group => group.Key, group => group.Count(), cancellationToken);
    }

    public Task<Location?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default)
    {
        return Boxes(spaceId).SingleOrDefaultAsync(box => box.Id == id, cancellationToken);
    }

    public async Task AddAsync(Location box, CancellationToken cancellationToken = default)
    {
        await context.Locations.AddAsync(box, cancellationToken);
        await SaveBoxAsync(cancellationToken);
    }

    public async Task UpdateAsync(Location box, CancellationToken cancellationToken = default)
    {
        context.Locations.Update(box);
        await SaveBoxAsync(cancellationToken);
    }

    public async Task DeleteAsync(Location box, CancellationToken cancellationToken = default)
    {
        context.Locations.Remove(box);
        try
        {
            await SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 547 })
        {
            throw InventoryExceptions.BoxHasDependencies(exception);
        }
    }

    private async Task SaveBoxAsync(CancellationToken cancellationToken)
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
            throw InventoryExceptions.BoxNotFound(exception);
        }
    }
}
