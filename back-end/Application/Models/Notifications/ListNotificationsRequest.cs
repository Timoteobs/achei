using System.ComponentModel.DataAnnotations;

namespace Application.Models.Notifications;

public sealed class ListNotificationsRequest
{
    [Range(1, int.MaxValue, ErrorMessage = "A página deve ser maior que zero.")]
    public int Page { get; init; } = 1;

    [Range(1, 100, ErrorMessage = "Informe entre 1 e 100 notificações por página.")]
    public int PageSize { get; init; } = 20;

    [MaxLength(50, ErrorMessage = "Tipo deve ter no máximo 50 caracteres.")]
    public string? Type { get; init; }

    public bool? WasRead { get; init; }
}
