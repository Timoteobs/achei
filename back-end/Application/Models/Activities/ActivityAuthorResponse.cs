namespace Application.Models.Activities;

public sealed record ActivityAuthorResponse(long? Id, string Name, string? AvatarUrl, bool IsCurrentUser);
