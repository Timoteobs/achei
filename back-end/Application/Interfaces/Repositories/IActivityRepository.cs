using Application.Common;
using Domain.Modules.Audit.Entities;

namespace Application.Interfaces.Repositories;

public interface IActivityRepository
{
    Task<PagedResult<Activity>> ListBySpaceAsync(long spaceId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<IReadOnlyDictionary<(string Action, string EntityType), int>> CountByActionAndEntityTypeAsync(long spaceId, DateTime periodStart, DateTime periodEnd, CancellationToken cancellationToken = default);
    Task AddAsync(Activity activity, CancellationToken cancellationToken = default);
}
