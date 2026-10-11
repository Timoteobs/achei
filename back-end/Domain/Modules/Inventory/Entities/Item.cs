using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Inventory.Entities;

public class Item : BaseEntity
{
    public long LocationId { get; private set; }
    public long? CategoryId { get; private set; }
    public long? CreatedByUserId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public int Quantity { get; private set; } = 1;
    public string? Notes { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Item() { }

    public Item(long locationId, string name, long? categoryId = null,
        long? createdByUserId = null, string? description = null, int quantity = 1,
        string? notes = null)
    {
        DomainValidator.Validator(
            ValidationRule.Positive(locationId, "Local"),
            ValidationRule.PositiveWhenProvided(categoryId, "Categoria"),
            ValidationRule.PositiveWhenProvided(createdByUserId, "Usuário criador"),
            ValidationRule.Required(name, "Nome"),
            ValidationRule.MaxLength(name, 150, "Nome"),
            ValidationRule.MaxLength(description, 1000, "Descrição"),
            ValidationRule.Positive(quantity, "Quantidade"),
            ValidationRule.MaxLength(notes, 1000, "Observações")
        );

        LocationId = locationId;
        CategoryId = categoryId;
        CreatedByUserId = createdByUserId;
        Name = name.Trim();
        Description = description?.Trim();
        Quantity = quantity;
        Notes = notes?.Trim();
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }
}
