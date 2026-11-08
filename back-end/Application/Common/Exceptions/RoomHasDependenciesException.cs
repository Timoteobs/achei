namespace Application.Common.Exceptions;

public sealed class RoomHasDependenciesException(Exception? innerException = null)
    : Exception("Não é possível excluir um ambiente com registros vinculados. Remova os vínculos antes de excluir.", innerException);
