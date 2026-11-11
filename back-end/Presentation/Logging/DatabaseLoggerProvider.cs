using System.Diagnostics;
using System.Threading.Channels;
using Data.Logging;

namespace Achei.Logging;

public sealed class DatabaseLoggerProvider(Channel<SystemLog> channel) : ILoggerProvider
{
    public ILogger CreateLogger(string categoryName)
    {
        return new DatabaseLogger(channel.Writer, categoryName);
    }

    public void Dispose()
    {
    }

    private sealed class DatabaseLogger(ChannelWriter<SystemLog> writer, string categoryName) : ILogger
    {
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull
        {
            return null;
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return logLevel >= LogLevel.Warning && !categoryName.StartsWith("Microsoft.EntityFrameworkCore", StringComparison.Ordinal);
        }

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            if (!IsEnabled(logLevel))
            {
                return;
            }

            var message = formatter(state, exception);
            if (string.IsNullOrWhiteSpace(message) && exception is null)
            {
                return;
            }

            var traceId = Activity.Current?.TraceId.ToString();
            writer.TryWrite(new SystemLog(logLevel.ToString(), categoryName, eventId.Id, message, exception?.ToString(), traceId));
        }
    }
}
