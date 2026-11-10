namespace Application.Common.Exceptions;

public sealed class ItemNotFoundException()
    : Exception("Item não encontrado ou sem permissão de acesso.");
