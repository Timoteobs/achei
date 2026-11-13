namespace Application.Models.Items;

public sealed record RecentItemsResponse(IReadOnlyList<RecentItemResponse> Items);
