using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.Interfaces.Security;
using Application.Models.Auth;
using Microsoft.IdentityModel.Tokens;

namespace Crosscutting.Common.Core.Security;

public sealed class JwtTokenService : IJwtTokenService
{
    private readonly SymmetricSecurityKey _signingKey;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expirationMinutes;

    public JwtTokenService(byte[] key, string issuer, string audience, int expirationMinutes)
    {
        if (key.Length < 32)
        {
            throw new ArgumentException("A chave JWT deve possuir pelo menos 32 bytes.", nameof(key));
        }

        if (string.IsNullOrWhiteSpace(issuer))
        {
            throw new ArgumentException("Issuer JWT não configurado.", nameof(issuer));
        }

        if (string.IsNullOrWhiteSpace(audience))
        {
            throw new ArgumentException("Audience JWT não configurada.", nameof(audience));
        }

        if (expirationMinutes <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(expirationMinutes),
                "A expiração JWT deve ser maior que zero.");
        }

        _signingKey = new SymmetricSecurityKey(key);
        _issuer = issuer;
        _audience = audience;
        _expirationMinutes = expirationMinutes;
    }

    public JwtToken Generate(long userId, string name, string email)
    {
        if (userId <= 0)
        {
            throw new ArgumentOutOfRangeException(nameof(userId));
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Nome é obrigatório.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("E-mail é obrigatório.", nameof(email));
        }

        var issuedAt = DateTime.UtcNow;
        var expiresAt = issuedAt.AddMinutes(_expirationMinutes);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub,
                userId.ToString(CultureInfo.InvariantCulture)),
            new Claim(JwtRegisteredClaimNames.Name, name),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(JwtRegisteredClaimNames.Iat,
                EpochTime.GetIntDate(issuedAt).ToString(CultureInfo.InvariantCulture),
                ClaimValueTypes.Integer64),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            notBefore: issuedAt,
            expires: expiresAt,
            signingCredentials: new SigningCredentials(
                _signingKey,
                SecurityAlgorithms.HmacSha256));

        return new JwtToken(new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}
