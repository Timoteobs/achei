namespace Application.Models.Items;

public sealed record RecentItemResponse(long Id, string Name, RecentItemLocationResponse Room, RecentItemLocationResponse? Box, string LastAction, DateTime LastActivityAt);
