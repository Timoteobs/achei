using System.ComponentModel.DataAnnotations;

namespace Application.Models.Invitations;

public sealed class SaveInvitationRequest
{
    [Required(ErrorMessage = "E-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    [MaxLength(255, ErrorMessage = "E-mail deve ter no máximo 255 caracteres.")]
    public string Email { get; init; } = string.Empty;

    [Required(ErrorMessage = "Papel é obrigatório.")]
    [RegularExpression("(?i)^(EDITOR|VIEWER)$", ErrorMessage = "Papel deve ser EDITOR ou VIEWER.")]
    public string Role { get; init; } = string.Empty;

    [Required(ErrorMessage = "Expiração é obrigatória.")]
    public DateTimeOffset? ExpiresAt { get; init; }
}
