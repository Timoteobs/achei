using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Identity.Entities;

public class User : BaseEntity
{
    public bool Active { get; private set; } = true;
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string? Phone { get; private set; }
    public string? AvatarUrl { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    private User() { }

    public User(string name, string email, string? phone = null, string? avatarUrl = null,
        bool active = true)
    {
        DomainValidator.Validator(
            ValidationRule.Required(name, "Nome"),
            ValidationRule.MaxLength(name, 100, "Nome"),
            ValidationRule.Required(email, "E-mail"),
            ValidationRule.MaxLength(email, 255, "E-mail"),
            ValidationRule.Email(email, "E-mail"),
            ValidationRule.MaxLength(phone, 20, "Telefone"),
            ValidationRule.MaxLength(avatarUrl, 1000, "URL do avatar")
        );

        Active = active;
        Name = name.Trim();
        Email = email.Trim().ToLowerInvariant();
        Phone = phone?.Trim();
        AvatarUrl = avatarUrl?.Trim();
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = CreatedAt;
    }
}
