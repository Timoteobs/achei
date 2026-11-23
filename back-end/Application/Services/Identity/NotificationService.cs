using System.Text.Json;
using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services.Identity;
using Application.Models.Notifications;
using Domain.Modules.Identity.Entities;

namespace Application.Services.Identity;

public sealed class NotificationService(INotificationRepository notifications) : INotificationService
{
    #region Service Methods

    public async Task<NotificationsPageResponse> ListAsync(long userId, ListNotificationsRequest request, CancellationToken cancellationToken = default)
    {
        var result = await notifications.ListByUserAsync(userId, request.Page, request.PageSize, request.WasRead, request.Type, cancellationToken);
        var unreadCount = await notifications.CountUnreadByUserAsync(userId, cancellationToken);
        var totalPages = (int)Math.Ceiling(result.TotalCount / (double)request.PageSize);
        return new NotificationsPageResponse(result.Items.Select(ToResponse).ToArray(), request.Page, request.PageSize, result.TotalCount, totalPages, unreadCount);
    }

    public async Task<NotificationResponse> MarkAsReadAsync(long id, long userId, CancellationToken cancellationToken = default)
    {
        var notification = await notifications.GetByIdAndUserAsync(id, userId, cancellationToken) ?? throw IdentityExceptions.NotificationNotFound();
        notification.MarkAsRead();
        await notifications.UpdateAsync(notification, cancellationToken);
        return ToResponse(notification);
    }

    public async Task CreateAsync(long userId, string title, string message, string type, string? screenId = null, object? payload = null, CancellationToken cancellationToken = default)
    {
        var notification = new Notification(userId, title, message, type, screenId, SerializePayload(payload));
        await notifications.AddAsync(notification, cancellationToken);
    }

    #endregion

    #region Helper Methods

    private static NotificationResponse ToResponse(Notification notification)
    {
        return new NotificationResponse(
            notification.Id, notification.UserId, notification.Title, notification.Message, notification.Type, notification.ScreenId, notification.Payload,
            notification.WasRead, DateTime.SpecifyKind(notification.SentAt, DateTimeKind.Utc),
            notification.ReadAt.HasValue ? DateTime.SpecifyKind(notification.ReadAt.Value, DateTimeKind.Utc) : null,
            DateTime.SpecifyKind(notification.CreatedAt, DateTimeKind.Utc),
            notification.UpdatedAt.HasValue ? DateTime.SpecifyKind(notification.UpdatedAt.Value, DateTimeKind.Utc) : null);
    }

    private static string? SerializePayload(object? payload)
    {
        return payload is null ? null : JsonSerializer.Serialize(payload, JsonSerializerOptions.Web);
    }

    #endregion
}
