using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Audit.Entities;

public class Activity : BaseEntity
{
    public long SpaceId { get; private set; }
    public long? UserId { get; private set; }
    public string Action { get; private set; } = string.Empty;
    public string EntityType { get; private set; } = string.Empty;
    public long? EntityId { get; private set; }
    public string? Metadata { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Activity() { }

    public Activity(long spaceId, string action, string entityType, long? userId = null,
        long? entityId = null, string? metadata = null)
    {
        DomainValidator.Validator(
            ValidationRule.Positive(spaceId, "Espaço"),
            ValidationRule.PositiveWhenProvided(userId, "Usuário"),
            ValidationRule.PositiveWhenProvided(entityId, "Entidade"),
            ValidationRule.Required(action, "Ação"),
            ValidationRule.MaxLength(action, 50, "Ação"),
            ValidationRule.Required(entityType, "Tipo da entidade"),
            ValidationRule.MaxLength(entityType, 30, "Tipo da entidade")
        );

        SpaceId = spaceId;
        UserId = userId;
        Action = action.Trim().ToUpperInvariant();
        EntityType = entityType.Trim().ToUpperInvariant();
        EntityId = entityId;
        Metadata = metadata;
        CreatedAt = DateTime.UtcNow;
    }
}
