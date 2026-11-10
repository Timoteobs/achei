namespace Application.Models.Items;

public sealed record ItemListQuery(int Page, int PageSize, string Sort, long? LocationId, string? Search);
