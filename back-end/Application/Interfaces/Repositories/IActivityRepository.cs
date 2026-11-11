using Domain.Modules.Audit.Entities;

namespace Application.Interfaces.Repositories;

public interface IActivityRepository
{
    Task AddAsync(Activity activity, CancellationToken cancellationToken = default);
}
