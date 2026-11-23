using Application.Common;
using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Identity.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Identity;

public sealed class NotificationRepository(AcheiContext context) : INotificationRepository
{
    public async Task<PagedResult<Notification>> ListByUserAsync(long userId, int page, int pageSize, bool? wasRead, string? type, CancellationToken cancellationToken = default)
    {
        var normalizedType = string.IsNullOrWhiteSpace(type) ? null : type.Trim().ToUpperInvariant();
        var query = context.Notifications.AsNoTracking().Where(notification => notification.UserId == userId);
        if (wasRead.HasValue)
        {
            query = query.Where(notification => notification.WasRead == wasRead.Value);
        }

        if (normalizedType is not null)
        {
            query = query.Where(notification => notification.Type == normalizedType);
        }

        var totalCount = await query.CountAsync(cancellationToken);
        var offset = ((long)page - 1) * pageSize;
        if (offset >= totalCount)
        {
            return new PagedResult<Notification>(Array.Empty<Notification>(), totalCount);
        }

        var result = await query.OrderByDescending(notification => notification.SentAt).ThenByDescending(notification => notification.Id)
            .Skip((int)offset).Take(pageSize).ToListAsync(cancellationToken);
        return new PagedResult<Notification>(result, totalCount);
    }

    public Task<int> CountUnreadByUserAsync(long userId, CancellationToken cancellationToken = default)
    {
        return context.Notifications.AsNoTracking().CountAsync(notification => notification.UserId == userId && !notification.WasRead, cancellationToken);
    }

    public Task<Notification?> GetByIdAndUserAsync(long id, long userId, CancellationToken cancellationToken = default)
    {
        return context.Notifications.SingleOrDefaultAsync(notification => notification.Id == id && notification.UserId == userId, cancellationToken);
    }

    public async Task AddAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        await context.Notifications.AddAsync(notification, cancellationToken);
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 547 })
        {
            throw IdentityExceptions.NotificationReferenceNotFound(exception);
        }
    }

    public async Task UpdateAsync(Notification notification, CancellationToken cancellationToken = default)
    {
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException exception)
        {
            throw IdentityExceptions.NotificationNotFound(exception);
        }
    }
}
