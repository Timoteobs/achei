using Application.Common;
using Domain.Modules.Identity.Entities;

namespace Application.Interfaces.Repositories;

public interface INotificationRepository
{
    Task<PagedResult<Notification>> ListByUserAsync(long userId, int page, int pageSize, bool? wasRead, string? type, CancellationToken cancellationToken = default);
    Task<int> CountUnreadByUserAsync(long userId, CancellationToken cancellationToken = default);
    Task<Notification?> GetByIdAndUserAsync(long id, long userId, CancellationToken cancellationToken = default);
    Task AddAsync(Notification notification, CancellationToken cancellationToken = default);
    Task UpdateAsync(Notification notification, CancellationToken cancellationToken = default);
}
