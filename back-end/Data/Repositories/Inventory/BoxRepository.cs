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
    public async Task<IReadOnlyList<BoxResponse>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default) =>
        await (from box in context.Locations.AsNoTracking()
               join room in context.Locations.AsNoTracking() on box.ParentLocationId equals (long?)room.Id
               where box.SpaceId == spaceId && box.Type == LocationTypes.Box
                   && room.SpaceId == spaceId && room.Type == LocationTypes.Room
                   && room.ParentLocationId == null
               orderby box.CreatedAt descending, box.Id descending
               select new BoxResponse(
                   box.Id, box.SpaceId, room.Id, room.Name, box.Name, box.Description,
                   context.Items.Count(item => item.LocationId == box.Id),
                   DateTime.SpecifyKind(box.CreatedAt, DateTimeKind.Utc),
                   DateTime.SpecifyKind(box.UpdatedAt, DateTimeKind.Utc)))
            .ToListAsync(cancellationToken);

    public async Task AddAsync(Location box, CancellationToken cancellationToken = default)
    {
        await context.Locations.AddAsync(box, cancellationToken);
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 547 })
        {
            // The parent may have been removed after the service validated it.
            throw new RoomNotFoundException();
        }
    }
}
