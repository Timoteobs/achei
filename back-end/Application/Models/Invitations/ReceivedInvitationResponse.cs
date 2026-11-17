namespace Application.Models.Invitations;

public sealed record ReceivedInvitationResponse(
    long Id, long SpaceId, string SpaceName, string InvitedByName, string Role, string Status,
    DateTime ExpiresAt, DateTime? AcceptedAt, DateTime CreatedAt);
