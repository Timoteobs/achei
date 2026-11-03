using System.ComponentModel.DataAnnotations;

namespace Application.Models.Auth;

public sealed class LoginRequest
{
    [Required(ErrorMessage = "E-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    public string Email { get; init; } = string.Empty;

    [Required(ErrorMessage = "Senha é obrigatória.")]
    public string Password { get; init; } = string.Empty;
}
