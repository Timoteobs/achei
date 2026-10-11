using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Inventory.Entities;

public class Tag : BaseEntity
{
    public long SpaceId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? Color { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Tag() { }

    public Tag(long spaceId, string name, string? color = null)
    {
        DomainValidator.Validator(
            ValidationRule.Positive(spaceId, "Espaço"),
            ValidationRule.Required(name, "Nome"),
            ValidationRule.MaxLength(name, 50, "Nome"),
            ValidationRule.MaxLength(color, 20, "Cor")
        );

        SpaceId = spaceId;
        Name = name.Trim();
        Color = color?.Trim();
        CreatedAt = DateTime.UtcNow;
    }
}
