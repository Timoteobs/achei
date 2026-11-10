using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Spaces.Entities;

public class Invitation : BaseEntity
{
    public long SpaceId { get; private set; }
    public long InvitedByUserId { get; private set; }
    public string? Email { get; private set; }
    public string Token { get; private set; } = string.Empty;
    public string Role { get; private set; } = string.Empty;
    public string Status { get; private set; } = "PENDING";
    public DateTime ExpiresAt { get; private set; }
    public DateTime? AcceptedAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Invitation() { }

    public Invitation(long spaceId, long invitedByUserId, string? email, string token, string role, DateTime expiresAt)
    {
        DomainValidator.Validator(
            ValidationRule.Positive(spaceId, "Espaço"),
            ValidationRule.Positive(invitedByUserId, "Usuário que convidou"),
            ValidationRule.MaxLength(email, 255, "E-mail"),
            ValidationRule.Email(email, "E-mail"),
            ValidationRule.Required(token, "Token"),
            ValidationRule.MaxLength(token, 255, "Token"),
            ValidationRule.Required(role, "Papel"),
            ValidationRule.MaxLength(role, 20, "Papel"),
            ValidationRule.OneOf(role, "Papel", "EDITOR", "VIEWER"),
            ValidationRule.FutureDate(expiresAt, "Expiração")
        );

        SpaceId = spaceId;
        InvitedByUserId = invitedByUserId;
        Email = email?.Trim().ToLowerInvariant();
        Token = token.Trim();
        Role = role.Trim().ToUpperInvariant();
        ExpiresAt = expiresAt;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }
}
