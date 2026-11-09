using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Models.Boxes;
using Data.Context;
using Domain.Modules.Inventory;
using Domain.Modules.Inventory.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Inventory;

public sealed class BoxRepository(AcheiContext context) : IBoxRepository
{
    private IQueryable<Location> Boxes(long spaceId) =>
        from box in context.Locations
        join room in context.Locations on box.ParentLocationId equals (long?)room.Id
        where box.SpaceId == spaceId && box.Type == LocationTypes.Box
            && room.SpaceId == spaceId && room.Type == LocationTypes.Room
            && room.ParentLocationId == null
        select box;

    private IQueryable<BoxResponse> WithRoomAndItemsCount(IQueryable<Location> boxes) =>
        from box in boxes
        join room in context.Locations.AsNoTracking() on box.ParentLocationId equals (long?)room.Id
        orderby box.CreatedAt descending, box.Id descending
        select new BoxResponse(
            box.Id, box.SpaceId, room.Id, room.Name, box.Name, box.Description,
            context.Items.Count(item => item.LocationId == box.Id),
            DateTime.SpecifyKind(box.CreatedAt, DateTimeKind.Utc),
            DateTime.SpecifyKind(box.UpdatedAt, DateTimeKind.Utc));

    public async Task<IReadOnlyList<BoxResponse>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default) =>
        await WithRoomAndItemsCount(Boxes(spaceId).AsNoTracking())
            .ToListAsync(cancellationToken);

    public Task<BoxResponse?> GetResponseAsync(long id, long spaceId, CancellationToken cancellationToken = default) =>
        WithRoomAndItemsCount(Boxes(spaceId).AsNoTracking().Where(box => box.Id == id))
            .SingleOrDefaultAsync(cancellationToken);

    public Task<Location?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default) =>
        Boxes(spaceId).SingleOrDefaultAsync(box => box.Id == id, cancellationToken);

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
            throw new BoxHasDependenciesException(exception);
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
            // The parent may have been removed after the service validated it.
            throw new RoomNotFoundException();
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
            throw new BoxNotFoundException();
        }
    }
}
