namespace Application.Models.Auth;

public sealed record UserResponse(long Id, string Name, string Email, string? Phone, string? AvatarUrl);
