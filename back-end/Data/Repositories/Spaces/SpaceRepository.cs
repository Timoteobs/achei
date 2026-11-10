using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Spaces.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Spaces;

public sealed class SpaceRepository(AcheiContext context) : ISpaceRepository
{
    public async Task<IReadOnlyList<Space>> ListByOwnerAsync(long ownerUserId, CancellationToken cancellationToken = default)
    {
        return await context.Spaces.AsNoTracking().Where(space => space.OwnerUserId == ownerUserId).OrderByDescending(space => space.CreatedAt).ThenByDescending(space => space.Id).ToListAsync(cancellationToken);
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
