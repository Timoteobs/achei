using System.IdentityModel.Tokens.Jwt;
using Application.Interfaces.Security;
using Crosscutting.Common.Core.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace Achei.Configurations;

public static class JwtConfig
{
    public static IServiceCollection AddJwtConfig(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var key = GetSigningKey(configuration);
        var issuer = GetRequiredValue(configuration, "Jwt:Issuer");
        var audience = GetRequiredValue(configuration, "Jwt:Audience");
        var expirationMinutes = configuration.GetValue<int>("Jwt:ExpirationMinutes");

        if (expirationMinutes <= 0)
            throw new InvalidOperationException(
                "Configuração 'Jwt:ExpirationMinutes' deve ser maior que zero.");

        var signingKey = new SymmetricSecurityKey(key);

        services.AddSingleton<IJwtTokenService>(
            new JwtTokenService(key, issuer, audience, expirationMinutes));

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ValidateLifetime = true,
                    RequireExpirationTime = true,
                    RequireSignedTokens = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = signingKey,
                    NameClaimType = JwtRegisteredClaimNames.Name,
                    ClockSkew = TimeSpan.FromSeconds(30)
                };
            });

        services.AddAuthorization();
        return services;
    }

    private static byte[] GetSigningKey(IConfiguration configuration)
    {
        var keyBase64 = GetRequiredValue(configuration, "Jwt:Key");

        try
        {
            var key = Convert.FromBase64String(keyBase64);

            if (key.Length < 32)
                throw new InvalidOperationException(
                    "A configuração 'Jwt:Key' deve possuir pelo menos 32 bytes.");

            return key;
        }
        catch (FormatException exception)
        {
            throw new InvalidOperationException(
                "A configuração 'Jwt:Key' deve estar em Base64.", exception);
        }
    }

    private static string GetRequiredValue(IConfiguration configuration, string key) =>
        configuration[key]
        ?? throw new InvalidOperationException($"Configuração '{key}' não encontrada.");
}
