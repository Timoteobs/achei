namespace Application.Common.Exceptions;

public sealed class BoxHasDependenciesException(Exception? innerException = null)
    : Exception("Não é possível excluir uma caixa com registros vinculados. Remova os vínculos antes de excluir.", innerException);
