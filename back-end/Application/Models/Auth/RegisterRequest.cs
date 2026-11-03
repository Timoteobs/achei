using System.ComponentModel.DataAnnotations;

namespace Application.Models.Auth;

public sealed class RegisterRequest
{
    [Required(ErrorMessage = "Nome é obrigatório.")]
    [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres.")]
    public string Name { get; init; } = string.Empty;

    [Required(ErrorMessage = "E-mail é obrigatório.")]
    [EmailAddress(ErrorMessage = "E-mail inválido.")]
    [MaxLength(255, ErrorMessage = "E-mail deve ter no máximo 255 caracteres.")]
    public string Email { get; init; } = string.Empty;

    [Required(ErrorMessage = "Senha é obrigatória.")]
    [StringLength(128, MinimumLength = 8, ErrorMessage = "Senha deve ter entre 8 e 128 caracteres.")]
    public string Password { get; init; } = string.Empty;

    [Required(ErrorMessage = "Confirmação da senha é obrigatória.")]
    [Compare(nameof(Password), ErrorMessage = "As senhas não conferem.")]
    public string ConfirmPassword { get; init; } = string.Empty;
}
