using System.Security.Cryptography;
using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Persistence;
using Application.Interfaces.Services.Spaces;
using Application.Models.Invitations;
using Domain.Modules.Spaces.Entities;

namespace Application.Services.Spaces;

public sealed class InvitationService(IInvitationRepository invitations, ISpaceRepository spaces, IUserRepository users, IMemberRepository members, IUnitOfWork unitOfWork) : IInvitationService
{
    #region Service Methods

    public async Task<IReadOnlyList<ReceivedInvitationResponse>> ListReceivedAsync(long userId, CancellationToken cancellationToken = default)
    {
        var result = await invitations.ListByRecipientAsync(userId, cancellationToken);
        if (result.Count == 0)
        {
            return Array.Empty<ReceivedInvitationResponse>();
        }

        var invitedSpaces = (await spaces.ListByInvitationRecipientAsync(userId, cancellationToken)).ToDictionary(space => space.Id);
        var authors = (await users.ListByIdsAsync(result.Select(invitation => invitation.InvitedByUserId).Distinct().ToArray(), cancellationToken)).ToDictionary(user => user.Id);
        return result.Select(invitation => ToResponse(invitation,
            invitedSpaces.GetValueOrDefault(invitation.SpaceId)?.Name ?? "Espaço indisponível",
            authors.GetValueOrDefault(invitation.InvitedByUserId)?.Name ?? "Usuário indisponível")).ToArray();
    }

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

    public Task<InvitationDecisionResponse> AcceptAsync(long id, long userId, CancellationToken cancellationToken = default)
    {
        return RespondAsync(id, userId, true, cancellationToken);
    }

    public Task<InvitationDecisionResponse> DeclineAsync(long id, long userId, CancellationToken cancellationToken = default)
    {
        return RespondAsync(id, userId, false, cancellationToken);
    }

    public async Task<InvitationResponse> RevokeAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await EnsureOwnedSpaceAsync(spaceId, userId, cancellationToken);
        InvitationResponse response = null!;
        await unitOfWork.ExecuteAsync(async transactionCancellationToken =>
        {
            var invitation = await GetInvitationAsync(id, spaceId, transactionCancellationToken);
            if (invitation.Status != "ACCEPTED")
            {
                throw SpacesExceptions.InvitationNotAccepted();
            }

            var recipient = await users.GetByEmailAsync(invitation.Email, transactionCancellationToken);
            if (recipient?.Id == userId)
            {
                throw SpacesExceptions.OwnerAccessCannotBeRevoked();
            }

            invitation.Revoke();
            if (!await invitations.TryRevokeAsync(invitation, transactionCancellationToken))
            {
                throw SpacesExceptions.InvitationUnavailable();
            }

            if (recipient is not null)
            {
                await members.DeleteBySpaceAndUserAsync(spaceId, recipient.Id, transactionCancellationToken);
            }

            response = ToResponse(invitation);
        }, cancellationToken);

        return response;
    }

    #endregion

    #region Helper Methods

    private async Task<InvitationDecisionResponse> RespondAsync(long id, long userId, bool accept, CancellationToken cancellationToken)
    {
        InvitationDecisionResponse response = null!;
        await unitOfWork.ExecuteAsync(async transactionCancellationToken =>
        {
            var invitation = await invitations.GetByIdAndRecipientAsync(id, userId, transactionCancellationToken)
                ?? throw SpacesExceptions.InvitationNotFound();

            if (invitation.Status != "PENDING" || invitation.AcceptedAt.HasValue)
            {
                throw SpacesExceptions.InvitationAlreadyAnswered();
            }
            if (invitation.ExpiresAt <= DateTime.UtcNow)
            {
                throw SpacesExceptions.InvitationExpired();
            }

            if (accept)
            {
                invitation.Accept();
            }
            else
            {
                invitation.Decline();
            }

            if (!await invitations.TryRespondAsync(invitation, userId, transactionCancellationToken))
            {
                throw SpacesExceptions.InvitationUnavailable();
            }

            if (accept && !await members.ExistsAsync(invitation.SpaceId, userId, transactionCancellationToken)
                && await spaces.GetByIdAndOwnerAsync(invitation.SpaceId, userId, transactionCancellationToken) is null)
            {
                await members.AddAsync(new Member(invitation.SpaceId, userId, invitation.Role, invitation.AcceptedAt), transactionCancellationToken);
            }

            response = ToResponse(invitation.Id, invitation.SpaceId, invitation.Status, invitation.AcceptedAt);
        }, cancellationToken);

        return response;
    }

    private static InvitationDecisionResponse ToResponse(long id, long spaceId, string status, DateTime? acceptedAt)
    {
        return new InvitationDecisionResponse(id, spaceId, status,
            acceptedAt.HasValue ? DateTime.SpecifyKind(acceptedAt.Value, DateTimeKind.Utc) : null);
    }

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

    private static ReceivedInvitationResponse ToResponse(Invitation invitation, string spaceName, string invitedByName)
    {
        var status = invitation.Status == "PENDING" && invitation.ExpiresAt <= DateTime.UtcNow ? "EXPIRED" : invitation.Status;
        return new ReceivedInvitationResponse(
            invitation.Id, invitation.SpaceId, spaceName, invitedByName, invitation.Role, status,
            DateTime.SpecifyKind(invitation.ExpiresAt, DateTimeKind.Utc),
            invitation.AcceptedAt.HasValue ? DateTime.SpecifyKind(invitation.AcceptedAt.Value, DateTimeKind.Utc) : null,
            DateTime.SpecifyKind(invitation.CreatedAt, DateTimeKind.Utc));
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
