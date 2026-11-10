namespace Application.Models.Spaces;

public sealed record SpaceResponse(long Id, long OwnerUserId, string Name, string? Description, string? ImageUrl, DateTime CreatedAt, DateTime UpdatedAt);
