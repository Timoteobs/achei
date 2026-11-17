namespace Application.Models.Spaces;

public sealed record SpaceDetailsResponse(
    long Id, long OwnerUserId, string Name, string? Description, string? ImageUrl, DateTime CreatedAt, DateTime UpdatedAt, string Role,
    int ItemsCount, int RoomsCount, int MembersCount, IReadOnlyList<SpaceMemberResponse> MembersPreview);
