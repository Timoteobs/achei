using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Audit.Entities;

namespace Data.Repositories.Audit;

public sealed class ActivityRepository(AcheiContext context) : IActivityRepository
{
    public async Task AddAsync(Activity activity, CancellationToken cancellationToken = default)
    {
        await context.Activities.AddAsync(activity, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }
}
