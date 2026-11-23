using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Spaces.Entities;

public class Invitation : BaseEntity
{
    public long SpaceId { get; private set; }
    public long InvitedByUserId { get; private set; }
    public string Email { get; private set; } = string.Empty;
    public string Token { get; private set; } = string.Empty;
    public string Role { get; private set; } = string.Empty;
    public string Status { get; private set; } = "PENDING";
    public DateTime ExpiresAt { get; private set; }
    public DateTime? AcceptedAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Invitation() { }

    public Invitation(long spaceId, long invitedByUserId, string email, string token, string role, DateTime expiresAt)
    {
        DomainValidator.Validator(
            ValidationRule.Positive(spaceId, "Espaço"),
            ValidationRule.Positive(invitedByUserId, "Usuário que convidou")
        );

        SpaceId = spaceId;
        InvitedByUserId = invitedByUserId;
        SetDetails(email, token, role, expiresAt);
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public void UpdateDetails(string email, string token, string role, DateTime expiresAt)
    {
        DomainValidator.Validator(ValidationRule.OneOf(AcceptedAt.HasValue ? "ACCEPTED" : Status, "Status do convite para edição", "PENDING"));
        SetDetails(email, token, role, expiresAt);
        UpdatedAt = DateTime.UtcNow;
    }

    public void Accept()
    {
        ValidatePendingResponse();
        Status = "ACCEPTED";
        AcceptedAt = DateTime.UtcNow;
        UpdatedAt = AcceptedAt.Value;
    }

    public void Decline()
    {
        ValidatePendingResponse();
        Status = "DECLINED";
        UpdatedAt = DateTime.UtcNow;
    }

    public void Revoke()
    {
        DomainValidator.Validator(ValidationRule.OneOf(Status, "Status do convite para revogação", "ACCEPTED"));
        Status = "REVOKED";
        UpdatedAt = DateTime.UtcNow;
    }

    private void ValidatePendingResponse()
    {
        DomainValidator.Validator(
            ValidationRule.OneOf(AcceptedAt.HasValue ? "ACCEPTED" : Status, "Status do convite para resposta", "PENDING"),
            ValidationRule.FutureDate(DateTime.SpecifyKind(ExpiresAt, DateTimeKind.Utc), "Expiração")
        );
    }

    private void SetDetails(string email, string token, string role, DateTime expiresAt)
    {
        var normalizedEmail = email?.Trim().ToLowerInvariant();
        var normalizedRole = role?.Trim().ToUpperInvariant();
        var expiration = expiresAt.Kind == DateTimeKind.Local ? expiresAt.ToUniversalTime() : DateTime.SpecifyKind(expiresAt, DateTimeKind.Utc);
        DomainValidator.Validator(
            ValidationRule.Required(normalizedEmail, "E-mail"),
            ValidationRule.MaxLength(normalizedEmail, 255, "E-mail"),
            ValidationRule.Email(normalizedEmail, "E-mail"),
            ValidationRule.Required(token, "Token"),
            ValidationRule.MaxLength(token, 255, "Token"),
            ValidationRule.Required(normalizedRole, "Papel"),
            ValidationRule.MaxLength(normalizedRole, 20, "Papel"),
            ValidationRule.OneOf(normalizedRole, "Papel", "EDITOR", "VIEWER"),
            ValidationRule.FutureDate(expiration, "Expiração")
        );

        Email = normalizedEmail!;
        Token = token.Trim();
        Role = normalizedRole!;
        ExpiresAt = expiration;
    }
}
