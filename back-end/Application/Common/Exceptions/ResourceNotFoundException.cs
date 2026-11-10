namespace Application.Common.Exceptions;

public sealed class ResourceNotFoundException(string code, string message, Exception? innerException = null) : Exception(message, innerException)
{
    public string Code { get; } = code;
}
