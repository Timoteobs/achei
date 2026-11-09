using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Inventory.Entities;

public class Location : BaseEntity
{
    public long SpaceId { get; private set; }
    public long? ParentLocationId { get; private set; }
    public long? CreatedByUserId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Type { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public string? Icon { get; private set; }
    public string? Color { get; private set; }
    public int Position { get; private set; }
    public string? QrCode { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Location() { }

    public Location(long spaceId, string name, string type, long? parentLocationId = null,
        long? createdByUserId = null, string? description = null, string? icon = null,
        string? color = null, int position = 0, string? qrCode = null)
    {
        DomainValidator.Validator(
            ValidationRule.Positive(spaceId, "Espaço"),
            ValidationRule.PositiveWhenProvided(parentLocationId, "Local pai"),
            ValidationRule.PositiveWhenProvided(createdByUserId, "Usuário criador"),
            ValidationRule.Required(name, "Nome"),
            ValidationRule.MaxLength(name, 100, "Nome"),
            ValidationRule.Required(type, "Tipo"),
            ValidationRule.MaxLength(type, 30, "Tipo"),
            ValidationRule.MaxLength(description, 500, "Descrição"),
            ValidationRule.MaxLength(icon, 100, "Ícone"),
            ValidationRule.MaxLength(color, 20, "Cor"),
            ValidationRule.NonNegative(position, "Posição"),
            ValidationRule.MaxLength(qrCode, 255, "QR Code")
        );

        SpaceId = spaceId;
        ParentLocationId = parentLocationId;
        CreatedByUserId = createdByUserId;
        Name = name.Trim();
        Type = type.Trim().ToUpperInvariant();
        Description = description?.Trim();
        Icon = icon?.Trim();
        Color = color?.Trim();
        Position = position;
        QrCode = qrCode?.Trim();
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public void UpdateBoxDetails(string name, string? description, long roomId)
    {
        DomainValidator.Validator(ValidationRule.Positive(roomId, "Ambiente"));
        UpdateDetails(name, description, Icon, Color);
        ParentLocationId = roomId;
    }

    public void UpdateDetails(string name, string? description, string? icon, string? color)
    {
        DomainValidator.Validator(
            ValidationRule.Required(name, "Nome"),
            ValidationRule.MaxLength(name, 100, "Nome"),
            ValidationRule.MaxLength(description, 500, "Descrição"),
            ValidationRule.MaxLength(icon, 100, "Ícone"),
            ValidationRule.MaxLength(color, 20, "Cor")
        );

        Name = name.Trim();
        Description = description?.Trim();
        Icon = icon?.Trim();
        Color = color?.Trim();
        UpdatedAt = DateTime.UtcNow;
    }
}
