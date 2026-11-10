namespace Application.Common.Exceptions;

public sealed class ItemHasDependenciesException(Exception? innerException = null)
    : Exception("Não é possível excluir um item com registros vinculados. Remova os vínculos antes de excluir.", innerException);
