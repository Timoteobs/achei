using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Spaces.Entities;

public class Space : BaseEntity
{
    public long OwnerUserId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string? Description { get; private set; }
    public string? ImageUrl { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private Space() { }

    public Space(long ownerUserId, string name, string? description = null, string? imageUrl = null)
    {
        DomainValidator.Validator(ValidationRule.Positive(ownerUserId, "Usuário proprietário"));
        OwnerUserId = ownerUserId;
        SetDetails(name, description, imageUrl);
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public void Update(string name, string? description = null, string? imageUrl = null)
    {
        SetDetails(name, description, imageUrl);
        UpdatedAt = DateTime.UtcNow;
    }

    private void SetDetails(string name, string? description, string? imageUrl)
    {
        DomainValidator.Validator(
            ValidationRule.Required(name, "Nome"),
            ValidationRule.MaxLength(name, 100, "Nome"),
            ValidationRule.MaxLength(description, 500, "Descrição"),
            ValidationRule.MaxLength(imageUrl, 1000, "URL da imagem")
        );

        Name = name.Trim();
        Description = description?.Trim();
        ImageUrl = imageUrl?.Trim();
    }
}
