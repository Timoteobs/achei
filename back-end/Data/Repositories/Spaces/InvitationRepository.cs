using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Spaces.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Spaces;

public sealed class InvitationRepository(AcheiContext context) : IInvitationRepository
{
    public async Task<IReadOnlyList<Invitation>> ListByRecipientAsync(long userId, CancellationToken cancellationToken = default)
    {
        return await context.Invitations.AsNoTracking()
            .Where(invitation => invitation.Email != null && context.Users.Any(user => user.Id == userId && user.Active && user.Email == invitation.Email))
            .OrderByDescending(invitation => invitation.CreatedAt).ThenByDescending(invitation => invitation.Id).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Invitation>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default)
    {
        return await context.Invitations.AsNoTracking().Where(invitation => invitation.SpaceId == spaceId)
            .OrderByDescending(invitation => invitation.CreatedAt).ThenByDescending(invitation => invitation.Id).ToListAsync(cancellationToken);
    }

    public Task<Invitation?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default)
    {
        return context.Invitations.AsNoTracking().SingleOrDefaultAsync(invitation => invitation.Id == id && invitation.SpaceId == spaceId, cancellationToken);
    }

    public Task<Invitation?> GetByIdAndRecipientAsync(long id, long userId, CancellationToken cancellationToken = default)
    {
        return context.Invitations.AsNoTracking().SingleOrDefaultAsync(invitation => invitation.Id == id && invitation.Email != null &&
            context.Users.Any(user => user.Id == userId && user.Active && user.Email == invitation.Email), cancellationToken);
    }

    public async Task<bool> TryRespondAsync(Invitation invitation, long userId, CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        var affected = await context.Invitations
            .Where(current => current.Id == invitation.Id && current.SpaceId == invitation.SpaceId &&
                current.Status == "PENDING" && current.AcceptedAt == null && current.ExpiresAt > now &&
                current.Token == invitation.Token && current.Role == invitation.Role && current.Email == invitation.Email &&
                context.Users.Any(user => user.Id == userId && user.Active && user.Email == current.Email))
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(current => current.Status, invitation.Status)
                .SetProperty(current => current.AcceptedAt, invitation.AcceptedAt)
                .SetProperty(current => current.UpdatedAt, invitation.UpdatedAt), cancellationToken);
        return affected == 1;
    }

    public async Task<bool> TryRevokeAsync(Invitation invitation, CancellationToken cancellationToken = default)
    {
        var affected = await context.Invitations
            .Where(current => current.Id == invitation.Id && current.SpaceId == invitation.SpaceId &&
                current.Status == "ACCEPTED" && current.Email == invitation.Email)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(current => current.Status, invitation.Status)
                .SetProperty(current => current.UpdatedAt, invitation.UpdatedAt), cancellationToken);
        return affected == 1;
    }

    public async Task AddAsync(Invitation invitation, CancellationToken cancellationToken = default)
    {
        await context.Invitations.AddAsync(invitation, cancellationToken);
        await SaveInvitationAsync(cancellationToken);
    }

    public async Task UpdateAsync(Invitation invitation, CancellationToken cancellationToken = default)
    {
        var affected = await context.Invitations
            .Where(current => current.Id == invitation.Id && current.SpaceId == invitation.SpaceId &&
                current.Status == "PENDING" && current.AcceptedAt == null)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(current => current.Email, invitation.Email)
                .SetProperty(current => current.Token, invitation.Token)
                .SetProperty(current => current.Role, invitation.Role)
                .SetProperty(current => current.ExpiresAt, invitation.ExpiresAt)
                .SetProperty(current => current.UpdatedAt, invitation.UpdatedAt), cancellationToken);
        if (affected == 0)
        {
            throw SpacesExceptions.InvitationUnavailable();
        }
    }

    public async Task DeleteAsync(Invitation invitation, CancellationToken cancellationToken = default)
    {
        context.Invitations.Remove(invitation);
        try
        {
            await SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 547 })
        {
            throw SpacesExceptions.InvitationHasDependencies(exception);
        }
    }

    private async Task SaveInvitationAsync(CancellationToken cancellationToken)
    {
        try
        {
            await SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 547 })
        {
            throw SpacesExceptions.InvitationReferenceNotFound(exception);
        }
    }

    private async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateConcurrencyException exception)
        {
            throw SpacesExceptions.InvitationNotFound(exception);
        }
    }
}
