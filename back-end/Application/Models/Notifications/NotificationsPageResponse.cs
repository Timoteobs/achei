namespace Application.Models.Notifications;

public sealed record NotificationsPageResponse(IReadOnlyList<NotificationResponse> Items, int Page, int PageSize, int TotalCount, int TotalPages, int UnreadCount);
