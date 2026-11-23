namespace Application.Common.Exceptions;

public static class SpacesExceptions
{
    public static ForbiddenException ReadOnlyAccess()
    {
        return new ForbiddenException("spaces.read_only_access", "Você tem permissão apenas para visualizar este espaço.");
    }

    public static ResourceNotFoundException SpaceNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("spaces.space_not_found", "Espaço não encontrado ou sem permissão de acesso.", innerException);
    }

    public static BusinessConflictException SpaceHasDependencies(Exception? innerException = null)
    {
        return new BusinessConflictException("spaces.space_has_dependencies", "Não é possível excluir um espaço com registros vinculados. Remova os vínculos antes de excluir.", innerException);
    }

    public static BusinessConflictException InvitationNotAccepted()
    {
        return new BusinessConflictException("spaces.invitation_not_accepted", "Somente convites aceitos podem ter o acesso revogado.");
    }

    public static BusinessConflictException OwnerAccessCannotBeRevoked()
    {
        return new BusinessConflictException("spaces.owner_access_cannot_be_revoked", "O acesso do proprietário do espaço não pode ser revogado.");
    }

    public static BusinessConflictException MemberHasDependencies(Exception? innerException = null)
    {
        return new BusinessConflictException("spaces.member_has_dependencies", "Não é possível remover este membro enquanto houver registros vinculados a ele.", innerException);
    }

    public static BusinessConflictException InvitationAlreadyAnswered()
    {
        return new BusinessConflictException("spaces.invitation_already_answered", "Este convite já foi respondido.");
    }

    public static BusinessConflictException InvitationExpired()
    {
        return new BusinessConflictException("spaces.invitation_expired", "Este convite expirou. Solicite um novo convite.");
    }

    public static BusinessConflictException InvitationUnavailable()
    {
        return new BusinessConflictException("spaces.invitation_unavailable", "O convite foi alterado, cancelado, respondido ou expirou. Atualize a lista.");
    }

    public static BusinessConflictException MemberAlreadyExists(Exception? innerException = null)
    {
        return new BusinessConflictException("spaces.member_already_exists", "Você já é membro deste espaço. Atualize a lista e tente novamente.", innerException);
    }

    public static ResourceNotFoundException MemberReferenceNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("spaces.member_reference_not_found", "Espaço ou usuário não encontrado para adicionar o membro.", innerException);
    }

    public static ResourceNotFoundException InvitationNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("spaces.invitation_not_found", "Convite não encontrado neste espaço.", innerException);
    }

    public static BusinessConflictException InvitationNotPending()
    {
        return new BusinessConflictException("spaces.invitation_not_pending", "Somente convites pendentes podem ser editados.");
    }

    public static ResourceNotFoundException InvitationReferenceNotFound(Exception? innerException = null)
    {
        return new ResourceNotFoundException("spaces.invitation_reference_not_found", "Espaço ou usuário do convite não encontrado.", innerException);
    }
}
