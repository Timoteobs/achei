using System.Threading.Channels;
using Data.Context;
using Data.Logging;
using Microsoft.EntityFrameworkCore;

namespace Achei.Logging;

public sealed class SystemLogWorker(Channel<SystemLog> channel, IServiceScopeFactory scopeFactory) : BackgroundService
{
    private const int BatchSize = 100;
    private static readonly TimeSpan FlushInterval = TimeSpan.FromSeconds(5);
    private static readonly TimeSpan RetentionPeriod = TimeSpan.FromDays(7);
    private static readonly TimeSpan CleanupInterval = TimeSpan.FromDays(1);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var nextCleanupAt = DateTime.UtcNow;
        using var timer = new PeriodicTimer(FlushInterval);

        try
        {
            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                await PersistPendingAsync(stoppingToken);

                if (DateTime.UtcNow >= nextCleanupAt)
                {
                    await DeleteExpiredAsync(stoppingToken);
                    nextCleanupAt = DateTime.UtcNow.Add(CleanupInterval);
                }
            }
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
        }
    }

    private async Task PersistPendingAsync(CancellationToken cancellationToken)
    {
        while (true)
        {
            var logs = new List<SystemLog>(BatchSize);
            while (logs.Count < BatchSize && channel.Reader.TryRead(out var log))
            {
                logs.Add(log);
            }

            if (logs.Count == 0)
            {
                return;
            }

            try
            {
                using var scope = scopeFactory.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AcheiContext>();
                await context.SystemLogs.AddRangeAsync(logs, cancellationToken);
                await context.SaveChangesAsync(cancellationToken);
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                Console.Error.WriteLine($"Não foi possível persistir o lote de logs do sistema: {exception.Message}");
            }
        }
    }

    private async Task DeleteExpiredAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = scopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AcheiContext>();
            var cutoff = DateTime.UtcNow.Subtract(RetentionPeriod);
            await context.SystemLogs.Where(log => log.CreatedAt < cutoff).ExecuteDeleteAsync(cancellationToken);
        }
        catch (Exception exception) when (exception is not OperationCanceledException)
        {
            Console.Error.WriteLine($"Não foi possível remover os logs expirados do sistema: {exception.Message}");
        }
    }
}
