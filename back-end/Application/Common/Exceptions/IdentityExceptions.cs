namespace Application.Common.Exceptions;

public static class IdentityExceptions
{
    public static BusinessConflictException EmailAlreadyRegistered(Exception? innerException = null)
    {
        return new BusinessConflictException("identity.email_already_registered", "E-mail já cadastrado.", innerException);
    }

    public static UnauthorizedException InvalidCredentials(Exception? innerException = null)
    {
        return new UnauthorizedException("identity.invalid_credentials", "E-mail ou senha inválidos.", innerException);
    }

    public static UnauthorizedException InvalidUserClaim(Exception? innerException = null)
    {
        return new UnauthorizedException("identity.invalid_user_claim", "Token sem identificação válida de usuário.", innerException);
    }
}
