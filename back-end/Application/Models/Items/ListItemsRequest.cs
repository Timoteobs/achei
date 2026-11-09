using System.ComponentModel.DataAnnotations;

namespace Application.Models.Items;

public sealed class ListItemsRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "A página deve ser maior que zero.")]
    public int Page { get; init; } = 1;

    [Range(1, 100, ErrorMessage = "Informe entre 1 e 100 itens por página.")]
    public int PageSize { get; init; } = 20;

    [Required(ErrorMessage = "Informe a ordenação.")]
    [RegularExpression("^(recent|oldest|name-asc|name-desc)$", ErrorMessage = "Ordenação inválida. Use recent, oldest, name-asc ou name-desc.")]
    public string Sort { get; init; } = "recent";

    [MaxLength(150, ErrorMessage = "A busca deve ter no máximo 150 caracteres.")]
    public string? Search { get; init; }
}
