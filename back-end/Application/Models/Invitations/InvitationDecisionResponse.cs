namespace Application.Models.Invitations;

public sealed record InvitationDecisionResponse(long Id, long SpaceId, string Status, DateTime? AcceptedAt);
