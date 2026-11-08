namespace Application.Common.Exceptions;

public sealed class RoomNotFoundException()
    : Exception("Ambiente não encontrado ou sem permissão de acesso.");
