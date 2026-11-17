using Domain.Modules.Spaces.Entities;

namespace Application.Interfaces.Repositories;

public interface IMemberRepository
{
    Task<bool> ExistsAsync(long spaceId, long userId, CancellationToken cancellationToken = default);
    Task AddAsync(Member member, CancellationToken cancellationToken = default);
}
