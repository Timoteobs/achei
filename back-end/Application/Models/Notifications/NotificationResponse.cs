namespace Application.Models.Notifications;

public sealed record NotificationResponse(
    long Id, long UserId, string Title, string Message, string Type, string? ScreenId, string? Payload,
    bool WasRead, DateTime SentAt, DateTime? ReadAt, DateTime CreatedAt, DateTime? UpdatedAt);
