using System.Security.Cryptography;
using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services.Spaces;
using Application.Models.Invitations;
using Domain.Modules.Spaces.Entities;

namespace Application.Services.Spaces;

public sealed class InvitationService(IInvitationRepository invitations, ISpaceRepository spaces) : IInvitationService
{
    #region Service Methods

    public async Task<IReadOnlyList<InvitationResponse>> ListAsync(long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var result = await invitations.ListBySpaceAsync(spaceId, cancellationToken);
        return result.Select(ToResponse).ToArray();
    }

    public async Task<InvitationResponse> GetByIdAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        return ToResponse(await GetInvitationAsync(id, spaceId, cancellationToken));
    }

    public async Task<InvitationResponse> CreateAsync(long spaceId, long userId, SaveInvitationRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var invitation = new Invitation(spaceId, userId, request.Email, GenerateToken(), request.Role, request.ExpiresAt.GetValueOrDefault().UtcDateTime);
        await invitations.AddAsync(invitation, cancellationToken);
        return ToResponse(invitation);
    }

    public async Task<InvitationResponse> UpdateAsync(long id, long spaceId, long userId, SaveInvitationRequest request, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var invitation = await GetInvitationAsync(id, spaceId, cancellationToken);
        if (invitation.Status != "PENDING" || invitation.AcceptedAt.HasValue)
        {
            throw SpacesExceptions.InvitationNotPending();
        }

        // Renovar o token invalida o link anterior ao alterar destinatário, permissão ou validade.
        invitation.UpdateDetails(request.Email, GenerateToken(), request.Role, request.ExpiresAt.GetValueOrDefault().UtcDateTime);
        await invitations.UpdateAsync(invitation, cancellationToken);
        return ToResponse(invitation);
    }

    public async Task DeleteAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        var invitation = await GetInvitationAsync(id, spaceId, cancellationToken);
        await invitations.DeleteAsync(invitation, cancellationToken);
    }

    #endregion

    #region Helper Methods

    private async Task EnsureOwnedSpaceAsync(long spaceId, long userId, CancellationToken cancellationToken)
    {
        if (await spaces.GetByIdAndOwnerAsync(spaceId, userId, cancellationToken) is null)
        {
            throw SpacesExceptions.SpaceNotFound();
        }
    }

    private async Task<Invitation> GetInvitationAsync(long id, long spaceId, CancellationToken cancellationToken)
    {
        return await invitations.GetByIdAndSpaceAsync(id, spaceId, cancellationToken) ?? throw SpacesExceptions.InvitationNotFound();
    }

    private static string GenerateToken()
    {
        return Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
    }

    private static InvitationResponse ToResponse(Invitation invitation)
    {
        var status = invitation.Status == "PENDING" && invitation.ExpiresAt <= DateTime.UtcNow ? "EXPIRED" : invitation.Status;
        return new InvitationResponse(
            invitation.Id, invitation.SpaceId, invitation.InvitedByUserId, invitation.Email, invitation.Token, invitation.Role, status,
            DateTime.SpecifyKind(invitation.ExpiresAt, DateTimeKind.Utc),
            invitation.AcceptedAt.HasValue ? DateTime.SpecifyKind(invitation.AcceptedAt.Value, DateTimeKind.Utc) : null,
            DateTime.SpecifyKind(invitation.CreatedAt, DateTimeKind.Utc),
            DateTime.SpecifyKind(invitation.UpdatedAt, DateTimeKind.Utc));
    }

    #endregion
}
