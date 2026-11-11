namespace Application.Models.Activities;

public sealed record ActivityIndicatorsResponse(
    long SpaceId,
    DateTime PeriodStart,
    DateTime PeriodEnd,
    int TotalActivities,
    int ItemsAdded,
    int ItemsUpdated,
    int ItemsRemoved);
