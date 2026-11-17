using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Identity.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Identity;

public sealed class UserRepository(AcheiContext context) : IUserRepository
{
    public Task<int> CountBySpaceAsync(long spaceId, CancellationToken cancellationToken = default)
    {
        return SpaceUsers(spaceId).CountAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<User>> ListBySpaceAsync(long spaceId, int limit, CancellationToken cancellationToken = default)
    {
        return await SpaceUsers(spaceId)
            .OrderByDescending(user => context.Spaces.Any(space => space.Id == spaceId && space.OwnerUserId == user.Id))
            .ThenBy(user => user.Name).ThenBy(user => user.Id)
            .Take(limit).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<User>> ListByIdsAsync(IReadOnlyCollection<long> ids, CancellationToken cancellationToken = default)
    {
        if (ids.Count == 0)
        {
            return Array.Empty<User>();
        }

        return await context.Users.AsNoTracking().Where(user => ids.Contains(user.Id)).ToListAsync(cancellationToken);
    }

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return context.Users.SingleOrDefaultAsync(user => user.Email == NormalizeEmail(email), cancellationToken);
    }

    public Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        return context.Users.AnyAsync(user => user.Email == NormalizeEmail(email), cancellationToken);
    }

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await context.Users.AddAsync(user, cancellationToken);

        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 2601 or 2627 })
        {
            throw IdentityExceptions.EmailAlreadyRegistered(exception);
        }
    }

    private IQueryable<User> SpaceUsers(long spaceId)
    {
        return context.Users.AsNoTracking().Where(user =>
            context.Spaces.Any(space => space.Id == spaceId && space.OwnerUserId == user.Id) ||
            context.Members.Any(member => member.SpaceId == spaceId && member.UserId == user.Id &&
                (member.Role == "EDITOR" || member.Role == "VIEWER")));
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLowerInvariant();
    }
}
