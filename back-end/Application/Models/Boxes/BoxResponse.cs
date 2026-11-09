namespace Application.Models.Boxes;

public sealed record BoxResponse(
    long Id,
    long SpaceId,
    long RoomId,
    string RoomName,
    string Name,
    string? Description,
    int ItemsCount,
    DateTime CreatedAt,
    DateTime UpdatedAt);
