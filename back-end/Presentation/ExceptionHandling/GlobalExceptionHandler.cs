using Application.Common.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace Achei.ExceptionHandling;

public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is OperationCanceledException && httpContext.RequestAborted.IsCancellationRequested)
        {
            return false;
        }

        var (status, title, detail, code) = exception switch
        {
            ResourceNotFoundException notFound => (StatusCodes.Status404NotFound, "Recurso não encontrado.", exception.Message, notFound.Code),
            BusinessConflictException conflict => (StatusCodes.Status409Conflict, "Conflito de negócio.", exception.Message, conflict.Code),
            UnauthorizedException unauthorized => (StatusCodes.Status401Unauthorized, "Falha na autenticação.", exception.Message, unauthorized.Code),
            ArgumentException => (StatusCodes.Status400BadRequest, "Dados inválidos.", exception.Message, null),
            _ => (StatusCodes.Status500InternalServerError, "Erro interno do servidor.", "Ocorreu um erro inesperado.", null)
        };

        if (status == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Erro não tratado durante a requisição.");
        }

        var extensions = code is null ? null : new Dictionary<string, object?> { ["code"] = code };

        await Results.Problem(statusCode: status, title: title, detail: detail, extensions: extensions).ExecuteAsync(httpContext);

        return true;
    }
}
