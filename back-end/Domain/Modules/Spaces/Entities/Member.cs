using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Spaces.Entities;

public class Member : BaseEntity
{
    public long SpaceId { get; private set; }
    public long UserId { get; private set; }
    public string Role { get; private set; } = string.Empty;
    public DateTime? JoinedAt { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Member() { }

    public Member(long spaceId, long userId, string role, DateTime? joinedAt = null)
    {
        DomainValidator.Validator(
            ValidationRule.Positive(spaceId, "Espaço"),
            ValidationRule.Positive(userId, "Usuário"),
            ValidationRule.Required(role, "Papel"),
            ValidationRule.MaxLength(role, 20, "Papel"),
            ValidationRule.OneOf(role, "Papel", "OWNER", "EDITOR", "VIEWER")
        );

        SpaceId = spaceId;
        UserId = userId;
        Role = role.Trim().ToUpperInvariant();
        JoinedAt = joinedAt;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }
}
