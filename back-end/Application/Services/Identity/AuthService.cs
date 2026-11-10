using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Security;
using Application.Interfaces.Services.Identity;
using Application.Models.Auth;
using Domain.Modules.Identity.Entities;

namespace Application.Services.Identity;

public sealed class AuthService(IUserRepository users, IPasswordHasherService passwordHasher, IJwtTokenService jwtTokenService) : IAuthService
{
    #region Service Methods

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken = default)
    {
        if (await users.EmailExistsAsync(request.Email, cancellationToken))
        {
            throw IdentityExceptions.EmailAlreadyRegistered();
        }

        var passwordHash = passwordHasher.Hash(request.Password);
        var user = new User(request.Name, request.Email, passwordHash);

        await users.AddAsync(user, cancellationToken);
        return CreateResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var user = await users.GetByEmailAsync(request.Email, cancellationToken);

        if (user is null || !user.Active || !passwordHasher.Verify(request.Password, user.PasswordHash))
        {
            throw IdentityExceptions.InvalidCredentials();
        }

        return CreateResponse(user);
    }

    #endregion

    #region Helper Methods

    private AuthResponse CreateResponse(User user)
    {
        var token = jwtTokenService.Generate(user.Id, user.Name, user.Email);
        var userResponse = new UserResponse(user.Id, user.Name, user.Email, user.Phone, user.AvatarUrl);

        return new AuthResponse(token.AccessToken, token.ExpiresAt, userResponse);
    }

    #endregion
}
