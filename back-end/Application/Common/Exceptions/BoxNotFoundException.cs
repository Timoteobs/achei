namespace Application.Common.Exceptions;

public sealed class BoxNotFoundException()
    : Exception("Caixa não encontrada ou sem permissão de acesso.");
