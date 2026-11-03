namespace Application.Models.Auth;

public sealed record AuthResponse(string AccessToken, DateTime ExpiresAt, UserResponse User);
