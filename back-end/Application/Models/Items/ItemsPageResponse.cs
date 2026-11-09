namespace Application.Models.Items;

public sealed record ItemsPageResponse(
    IReadOnlyList<ItemResponse> Items,
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages);
