namespace Application.Models.Activities;

public sealed record ActivitiesPageResponse(IReadOnlyList<ActivityResponse> Items, int Page, int PageSize, int TotalCount, int TotalPages);
