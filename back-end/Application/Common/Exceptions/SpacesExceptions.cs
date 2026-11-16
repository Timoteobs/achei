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

    public static ResourceNotFoundException InvitationNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("spaces.invitation_not_found", "Convite não encontrado neste espaço.", innerException);
    }

    public static BusinessConflictException InvitationNotPending()
    {
        return new BusinessConflictException("spaces.invitation_not_pending", "Somente convites pendentes podem ser editados.");
    }

    public static BusinessConflictException InvitationHasDependencies(Exception? innerException = null)
    {
        return new BusinessConflictException("spaces.invitation_has_dependencies", "Não é possível excluir um convite com registros vinculados.", innerException);
    }

    public static ResourceNotFoundException InvitationReferenceNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("spaces.invitation_reference_not_found", "Espaço ou usuário do convite não encontrado.", innerException);
    }
}
