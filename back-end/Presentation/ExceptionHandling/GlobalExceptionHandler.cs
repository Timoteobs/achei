using Application.Common.Exceptions;
using Microsoft.AspNetCore.Diagnostics;

namespace Achei.ExceptionHandling;

public sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is OperationCanceledException && httpContext.RequestAborted.IsCancellationRequested)
            return false;

        var (status, title, detail) = exception switch
        {
            ItemNotFoundException => (StatusCodes.Status404NotFound, "Item não encontrado.", exception.Message),
            ItemHasDependenciesException => (StatusCodes.Status409Conflict, "Não foi possível excluir o item.", exception.Message),
            ItemReferenceNotFoundException => (StatusCodes.Status404NotFound, "Local ou categoria indisponível.", exception.Message),
            BoxNotFoundException => (StatusCodes.Status404NotFound, "Caixa não encontrada.", exception.Message),
            BoxHasDependenciesException => (StatusCodes.Status409Conflict, "Não foi possível excluir a caixa.", exception.Message),
            RoomNotFoundException => (StatusCodes.Status404NotFound, "Ambiente não encontrado.", exception.Message),
            RoomHasDependenciesException => (StatusCodes.Status409Conflict, "Não foi possível excluir o ambiente.", exception.Message),
            SpaceNotFoundException => (StatusCodes.Status404NotFound, "Espaço não encontrado.", exception.Message),
            SpaceHasDependenciesException => (StatusCodes.Status409Conflict, "Não foi possível excluir o espaço.", exception.Message),
            EmailAlreadyRegisteredException => (StatusCodes.Status409Conflict, "Não foi possível criar a conta.", exception.Message),
            UnauthorizedAccessException => (StatusCodes.Status401Unauthorized, "Falha na autenticação.", exception.Message),
            ArgumentException => (StatusCodes.Status400BadRequest, "Dados inválidos.", exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "Erro interno do servidor.", "Ocorreu um erro inesperado.")
        };

        if (status == StatusCodes.Status500InternalServerError)
            logger.LogError(exception, "Erro não tratado durante a requisição.");

        await Results.Problem(statusCode: status, title: title, detail: detail).ExecuteAsync(httpContext);

        return true;
    }
}
