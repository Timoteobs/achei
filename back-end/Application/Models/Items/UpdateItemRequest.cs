using System.ComponentModel.DataAnnotations;

namespace Application.Models.Items;

public sealed class UpdateItemRequest
{
    [Range(1, long.MaxValue, ErrorMessage = "Selecione um local válido.")]
    public long LocationId { get; init; }

    [Range(1, long.MaxValue, ErrorMessage = "Selecione uma categoria válida.")]
    public long? CategoryId { get; init; }

    [Required(ErrorMessage = "Nome é obrigatório.")]
    [MaxLength(150, ErrorMessage = "Nome deve ter no máximo 150 caracteres.")]
    public string Name { get; init; } = string.Empty;

    [MaxLength(1000, ErrorMessage = "Descrição deve ter no máximo 1000 caracteres.")]
    public string? Description { get; init; }

    [Range(1, int.MaxValue, ErrorMessage = "Quantidade deve ser maior que zero.")]
    public int Quantity { get; init; } = 1;

    [MaxLength(1000, ErrorMessage = "Observações devem ter no máximo 1000 caracteres.")]
    public string? Notes { get; init; }
}
