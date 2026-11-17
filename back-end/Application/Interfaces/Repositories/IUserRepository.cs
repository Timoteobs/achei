using Domain.Modules.Identity.Entities;

namespace Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<int> CountBySpaceAsync(long spaceId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<User>> ListBySpaceAsync(long spaceId, int limit, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<User>> ListByIdsAsync(IReadOnlyCollection<long> ids, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);
    Task AddAsync(User user, CancellationToken cancellationToken = default);
}
