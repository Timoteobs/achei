using System.ComponentModel.DataAnnotations;

namespace Application.Models.Boxes;

public sealed class UpdateBoxRequest
{
    [Range(1, long.MaxValue, ErrorMessage = "Selecione um ambiente válido.")]
    public long RoomId { get; init; }

    [Required(ErrorMessage = "Nome é obrigatório.")]
    [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres.")]
    public string Name { get; init; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Descrição deve ter no máximo 500 caracteres.")]
    public string? Description { get; init; }
}
