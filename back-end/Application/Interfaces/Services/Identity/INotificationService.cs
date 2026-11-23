using Application.Models.Notifications;

namespace Application.Interfaces.Services.Identity;

public interface INotificationService
{
    Task<NotificationsPageResponse> ListAsync(long userId, ListNotificationsRequest request, CancellationToken cancellationToken = default);
    Task<NotificationResponse> MarkAsReadAsync(long id, long userId, CancellationToken cancellationToken = default);
    Task CreateAsync(long userId, string title, string message, string type, string? screenId = null, object? payload = null, CancellationToken cancellationToken = default);
}
