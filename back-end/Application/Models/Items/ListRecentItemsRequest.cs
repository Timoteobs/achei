using System.ComponentModel.DataAnnotations;

namespace Application.Models.Items;

public sealed class ListRecentItemsRequest
{
    [Range(1, 100, ErrorMessage = "Informe um limite entre 1 e 100 itens.")]
    public int Limit { get; init; } = 5;
}
