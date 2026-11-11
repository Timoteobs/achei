namespace Application.Models.Activities;

public sealed record ActivityResponse(long Id, long SpaceId, long? UserId, string Action, string EntityType, long? EntityId, string? Metadata, DateTime CreatedAt);
