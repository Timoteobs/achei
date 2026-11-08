using System.ComponentModel.DataAnnotations;

namespace Application.Models.Rooms;

public sealed class SaveRoomRequest
{
    [Required(ErrorMessage = "Nome é obrigatório.")]
    [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres.")]
    public string Name { get; init; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Descrição deve ter no máximo 500 caracteres.")]
    public string? Description { get; init; }

    [MaxLength(100, ErrorMessage = "Ícone deve ter no máximo 100 caracteres.")]
    public string? Icon { get; init; }

    [MaxLength(20, ErrorMessage = "Cor deve ter no máximo 20 caracteres.")]
    public string? Color { get; init; }
}
