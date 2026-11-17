using Domain.Modules.Spaces.Entities;

namespace Application.Interfaces.Repositories;

public interface IMemberRepository
{
    Task<IReadOnlyList<Member>> ListByUserAsync(long userId, CancellationToken cancellationToken = default);
    Task<Member?> GetBySpaceAndUserAsync(long spaceId, long userId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(long spaceId, long userId, CancellationToken cancellationToken = default);
    Task DeleteBySpaceAndUserAsync(long spaceId, long userId, CancellationToken cancellationToken = default);
    Task AddAsync(Member member, CancellationToken cancellationToken = default);
}
