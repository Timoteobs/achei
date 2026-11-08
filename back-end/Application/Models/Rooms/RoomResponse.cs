namespace Application.Models.Rooms;

public sealed record RoomResponse(
    long Id,
    long SpaceId,
    string Name,
    string? Description,
    string? Icon,
    string? Color,
    int BoxesCount,
    DateTime CreatedAt,
    DateTime UpdatedAt);
