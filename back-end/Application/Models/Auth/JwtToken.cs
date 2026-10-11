namespace Application.Models.Auth;

public sealed record JwtToken(string AccessToken, DateTime ExpiresAt);
