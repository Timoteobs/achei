namespace Application.Models.Items;

public sealed record ItemResponse(
    long Id,
    long SpaceId,
    long LocationId,
    long? CategoryId,
    long? CreatedByUserId,
    string Name,
    string? Description,
    int Quantity,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt);
