namespace Application.Common.Exceptions;

public sealed class SpaceHasDependenciesException(Exception? innerException = null)
    : Exception("Não é possível excluir um espaço com registros vinculados. Remova os vínculos antes de excluir.", innerException);
