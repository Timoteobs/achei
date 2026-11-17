using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Spaces.Entities;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Spaces;

public sealed class MemberRepository(AcheiContext context) : IMemberRepository
{
    public async Task<IReadOnlyList<Member>> ListByUserAsync(long userId, CancellationToken cancellationToken = default)
    {
        return await context.Members.AsNoTracking().Where(member => member.UserId == userId).ToListAsync(cancellationToken);
    }

    public Task<Member?> GetBySpaceAndUserAsync(long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        return context.Members.AsNoTracking().SingleOrDefaultAsync(member => member.SpaceId == spaceId && member.UserId == userId, cancellationToken);
    }

    public Task<bool> ExistsAsync(long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        return context.Members.AsNoTracking().AnyAsync(member => member.SpaceId == spaceId && member.UserId == userId, cancellationToken);
    }

    public async Task AddAsync(Member member, CancellationToken cancellationToken = default)
    {
        await context.Members.AddAsync(member, cancellationToken);
        try
        {
            await context.SaveChangesAsync(cancellationToken);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 2601 or 2627 })
        {
            throw SpacesExceptions.MemberAlreadyExists(exception);
        }
        catch (DbUpdateException exception) when (exception.InnerException is SqlException { Number: 547 })
        {
            throw SpacesExceptions.MemberReferenceNotFound(exception);
        }
        finally
        {
            // A nova tentativa da unidade transacional deve consultar o banco novamente.
            context.Entry(member).State = EntityState.Detached;
        }
    }
}
