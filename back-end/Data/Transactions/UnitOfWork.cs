using Application.Interfaces.Persistence;
using Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Data.Transactions;

public sealed class UnitOfWork(AcheiContext context) : IUnitOfWork
{
    public async Task ExecuteAsync(Func<CancellationToken, Task> operation, CancellationToken cancellationToken = default)
    {
        var strategy = context.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            await using var transaction = await context.Database.BeginTransactionAsync(cancellationToken);
            await operation(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        });
    }
}
