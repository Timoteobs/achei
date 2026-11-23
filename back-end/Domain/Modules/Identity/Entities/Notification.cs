using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Identity.Entities;

public class Notification : BaseEntity
{
    public long UserId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;
    public string Type { get; private set; } = string.Empty;
    public string? ScreenId { get; private set; }
    public string? Payload { get; private set; }
    public bool WasRead { get; private set; }
    public DateTime SentAt { get; private set; }
    public DateTime? ReadAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }

    private Notification() { }

    public Notification(long userId, string title, string message, string type, string? screenId = null, string? payload = null)
    {
        var normalizedTitle = title?.Trim();
        var normalizedMessage = message?.Trim();
        var normalizedType = type?.Trim().ToUpperInvariant();
        var normalizedScreenId = string.IsNullOrWhiteSpace(screenId) ? null : screenId.Trim();

        DomainValidator.Validator(
            ValidationRule.Positive(userId, "Usuário"),
            ValidationRule.Required(normalizedTitle, "Título"),
            ValidationRule.MaxLength(normalizedTitle, 200, "Título"),
            ValidationRule.Required(normalizedMessage, "Mensagem"),
            ValidationRule.MaxLength(normalizedMessage, 4000, "Mensagem"),
            ValidationRule.Required(normalizedType, "Tipo"),
            ValidationRule.MaxLength(normalizedType, 50, "Tipo"),
            ValidationRule.MaxLength(normalizedScreenId, 100, "Tela")
        );

        UserId = userId;
        Title = normalizedTitle!;
        Message = normalizedMessage!;
        Type = normalizedType!;
        ScreenId = normalizedScreenId;
        Payload = string.IsNullOrWhiteSpace(payload) ? null : payload;
        SentAt = DateTime.UtcNow;
        CreatedAt = SentAt;
    }

    public void MarkAsRead()
    {
        if (WasRead)
        {
            return;
        }

        WasRead = true;
        ReadAt = DateTime.UtcNow;
        UpdatedAt = ReadAt;
    }
}
