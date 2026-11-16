namespace Application.Models.Invitations;

public sealed record InvitationResponse(
    long Id, long SpaceId, long InvitedByUserId, string? Email, string Token, string Role, string Status,
    DateTime ExpiresAt, DateTime? AcceptedAt, DateTime CreatedAt, DateTime UpdatedAt);
