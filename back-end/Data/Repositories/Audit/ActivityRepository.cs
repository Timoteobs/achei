using Application.Common;
using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Audit;
using Domain.Modules.Audit.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Audit;

public sealed class ActivityRepository(AcheiContext context) : IActivityRepository
{
    public async Task<PagedResult<Activity>> ListBySpaceAsync(long spaceId, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        var query = context.Activities.AsNoTracking().Where(activity => activity.SpaceId == spaceId);
        var totalCount = await query.CountAsync(cancellationToken);
        var offset = ((long)page - 1) * pageSize;
        if (offset >= totalCount)
        {
            return new PagedResult<Activity>(Array.Empty<Activity>(), totalCount);
        }

        var result = await query.OrderByDescending(activity => activity.CreatedAt).ThenByDescending(activity => activity.Id)
            .Skip((int)offset).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Activity>(result, totalCount);
    }

    public async Task<IReadOnlyDictionary<(string Action, string EntityType), int>> CountByActionAndEntityTypeAsync(long spaceId, DateTime periodStart, DateTime periodEnd, CancellationToken cancellationToken = default)
    {
        var counts = await context.Activities.AsNoTracking()
            .Where(activity => activity.SpaceId == spaceId && activity.CreatedAt >= periodStart && activity.CreatedAt < periodEnd)
            .GroupBy(activity => new { activity.Action, activity.EntityType })
            .Select(group => new { group.Key.Action, group.Key.EntityType, Count = group.Count() })
            .ToListAsync(cancellationToken);

        return counts.ToDictionary(group => (group.Action, group.EntityType), group => group.Count);
    }

    public async Task<IReadOnlyList<Activity>> ListRecentItemsBySpaceAsync(long spaceId, int limit, CancellationToken cancellationToken = default)
    {
        var itemActivities = context.Activities.AsNoTracking()
            .Where(activity => activity.SpaceId == spaceId && activity.EntityType == ActivityEntityTypes.Item && activity.EntityId != null);

        var query = from activity in itemActivities
                    join item in context.Items.AsNoTracking() on activity.EntityId equals (long?)item.Id
                    join location in context.Locations.AsNoTracking() on item.LocationId equals location.Id
                    where location.SpaceId == spaceId && activity.Action != ActivityActions.Deleted &&
                        !itemActivities.Any(newer => newer.EntityId == activity.EntityId &&
                            (newer.CreatedAt > activity.CreatedAt || (newer.CreatedAt == activity.CreatedAt && newer.Id > activity.Id)))
                    select activity;

        return await query.OrderByDescending(activity => activity.CreatedAt).ThenByDescending(activity => activity.Id)
            .Take(limit).ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Activity activity, CancellationToken cancellationToken = default)
    {
        await context.Activities.AddAsync(activity, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }
}
