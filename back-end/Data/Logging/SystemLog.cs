namespace Data.Logging;

public sealed class SystemLog
{
    public long Id { get; private set; }
    public string Level { get; private set; } = string.Empty;
    public string Category { get; private set; } = string.Empty;
    public int EventId { get; private set; }
    public string Message { get; private set; } = string.Empty;
    public string? Exception { get; private set; }
    public string? TraceId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private SystemLog() { }

    public SystemLog(string level, string category, int eventId, string message, string? exception, string? traceId)
    {
        Level = Truncate(level, 20);
        Category = Truncate(category, 256);
        EventId = eventId;
        Message = Truncate(message, 4000);
        Exception = TruncateOptional(exception, 16000);
        TraceId = TruncateOptional(traceId, 32);
        CreatedAt = DateTime.UtcNow;
    }

    private static string Truncate(string value, int maximumLength)
    {
        return value.Length <= maximumLength ? value : value[..maximumLength];
    }

    private static string? TruncateOptional(string? value, int maximumLength)
    {
        return value is null ? null : Truncate(value, maximumLength);
    }
}
