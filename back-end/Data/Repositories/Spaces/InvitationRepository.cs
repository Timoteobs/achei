using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Spaces.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Spaces;

public sealed class InvitationRepository(AcheiContext context) : IInvitationRepository
{
    public async Task<IReadOnlyList<Invitation>> ListBySpaceAsync(long spaceId, CancellationToken cancellationToken = default)
    {
        return await context.Invitations.AsNoTracking().Where(invitation => invitation.SpaceId == spaceId)
            .OrderByDescending(invitation => invitation.CreatedAt).ThenByDescending(invitation => invitation.Id).ToListAsync(cancellationToken);
    }

    public Task<Invitation?> GetByIdAndSpaceAsync(long id, long spaceId, CancellationToken cancellationToken = default)
    {
        return context.Invitations.AsNoTracking().SingleOrDefaultAsync(invitation => invitation.Id == id && invitation.SpaceId == spaceId, cancellationToken);
    }

    public async Task AddAsync(Invitation invitation, CancellationToken cancellationToken = default)
    {
        await context.Invitations.AddAsync(invitation, cancellationToken);
        await SaveInvitationAsync(cancellationToken);
    }

    public async Task UpdateAsync(Invitation invitation, CancellationToken cancellationToken = default)
    {
        context.Invitations.Update(invitation);
        await SaveInvitationAsync(cancellationToken);
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
