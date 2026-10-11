using Application.Models.Auth;

namespace Application.Interfaces.Security;

public interface IJwtTokenService
{
    JwtToken Generate(long userId, string name, string email);
}
