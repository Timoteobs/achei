using System.ComponentModel.DataAnnotations;

namespace Application.Models.Spaces;

public sealed class SaveSpaceRequest
{
    [Required(ErrorMessage = "Nome é obrigatório.")]
    [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres.")]
    public string Name { get; init; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Descrição deve ter no máximo 500 caracteres.")]
    public string? Description { get; init; }

    [MaxLength(1000, ErrorMessage = "URL da imagem deve ter no máximo 1000 caracteres.")]
    [Url(ErrorMessage = "Informe uma URL de imagem válida.")]
    public string? ImageUrl { get; init; }
}
