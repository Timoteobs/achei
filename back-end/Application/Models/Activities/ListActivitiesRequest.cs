using System.ComponentModel.DataAnnotations;

namespace Application.Models.Activities;

public sealed class ListActivitiesRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "A página deve ser maior que zero.")]
    public int Page { get; init; } = 1;

    [Range(1, 100, ErrorMessage = "Informe entre 1 e 100 atividades por página.")]
    public int PageSize { get; init; } = 20;
}
