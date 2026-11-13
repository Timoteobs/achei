namespace Application.Models.Activities;

public sealed record ActivityLocationResponse(ActivityLocationEntryResponse Room, ActivityLocationEntryResponse? Box);

public sealed record ActivityLocationEntryResponse(long Id, string Name);
