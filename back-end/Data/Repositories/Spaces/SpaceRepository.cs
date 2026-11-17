using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Spaces.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Spaces;

public sealed class SpaceRepository(AcheiContext context) : ISpaceRepository
{
    public async Task<IReadOnlyList<Space>> ListByInvitationRecipientAsync(long userId, CancellationToken cancellationToken = default)
    {
        return await context.Spaces.AsNoTracking()
            .Where(space => context.Invitations.Any(invitation => invitation.SpaceId == space.Id && invitation.Email != null &&
                context.Users.Any(user => user.Id == userId && user.Active && user.Email == invitation.Email)))
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Space>> ListByUserAsync(long userId, CancellationToken cancellationToken = default)
    {
        return await AccessibleSpaces(userId).OrderByDescending(space => space.CreatedAt).ThenByDescending(space => space.Id).ToListAsync(cancellationToken);
    }

    public Task<Space?> GetByIdAndUserAsync(long id, long userId, CancellationToken cancellationToken = default)
    {
        return AccessibleSpaces(userId).SingleOrDefaultAsync(space => space.Id == id, cancellationToken);
    }

    private IQueryable<Space> AccessibleSpaces(long userId)
    {
        return context.Spaces.AsNoTracking().Where(space => space.OwnerUserId == userId ||
            context.Members.Any(member => member.SpaceId == space.Id && member.UserId == userId && (member.Role == "EDITOR" || member.Role == "VIEWER")));
    }

    public Task<Space?> GetByIdAndOwnerAsync(long id, long ownerUserId, CancellationToken cancellationToken = default)
    {
        return context.Spaces.SingleOrDefaultAsync(space => space.Id == id && space.OwnerUserId == ownerUserId, cancellationToken);
    }

    public async Task AddAsync(Space space, CancellationToken cancellationToken = default)
    {
        await context.Spaces.AddAsync(space, cancellationToken);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateAsync(Space space, CancellationToken cancellationToken = default)
    {
        context.Spaces.Update(space);
        await SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(Space space, CancellationToken cancellationToken = default)
    {
        context.Spaces.Remove(space);
        try
        {
            await SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 547 })
        {
            throw SpacesExceptions.SpaceHasDependencies(exception);
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
            throw SpacesExceptions.SpaceNotFound(exception);
        }
    }
}
