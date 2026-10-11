using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Inventory.Entities;

public class Category : BaseEntity
{
    public long? SpaceId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? Icon { get; private set; }
    public string? Color { get; private set; }
    public int Position { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Category() { }

    public Category(string name, long? spaceId = null, string? icon = null,
        string? color = null, int position = 0)
    {
        DomainValidator.Validator(
            ValidationRule.PositiveWhenProvided(spaceId, "Espaço"),
            ValidationRule.Required(name, "Nome"),
            ValidationRule.MaxLength(name, 50, "Nome"),
            ValidationRule.MaxLength(icon, 100, "Ícone"),
            ValidationRule.MaxLength(color, 20, "Cor"),
            ValidationRule.NonNegative(position, "Posição")
        );

        SpaceId = spaceId;
        Name = name.Trim();
        Icon = icon?.Trim();
        Color = color?.Trim();
        Position = position;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }
}
