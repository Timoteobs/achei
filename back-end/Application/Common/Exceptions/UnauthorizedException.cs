namespace Application.Common.Exceptions;

public sealed class UnauthorizedException(string code, string message, Exception? innerException = null) : Exception(message, innerException)
{
    public string Code { get; } = code;
}
