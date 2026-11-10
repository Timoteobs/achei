namespace Application.Common.Exceptions;

public static class SpacesExceptions
{
    public static ResourceNotFoundException SpaceNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("spaces.space_not_found", "Espaço não encontrado ou sem permissão de acesso.", innerException);
    }

    public static BusinessConflictException SpaceHasDependencies(Exception? innerException = null)
    {
        return new BusinessConflictException("spaces.space_has_dependencies", "Não é possível excluir um espaço com registros vinculados. Remova os vínculos antes de excluir.", innerException);
    }
}
