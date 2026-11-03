using Application.Interfaces.Repositories;
using Data.Context;
using Domain.Modules.Identity.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories.Identity;

public sealed class UserRepository(AcheiContext context) : IUserRepository
{
    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default) =>
        context.Users.SingleOrDefaultAsync( user => user.Email == NormalizeEmail(email), cancellationToken);

    public Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default) =>
        context.Users.AnyAsync(user => user.Email == NormalizeEmail(email), cancellationToken);

    public async Task AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await context.Users.AddAsync(user, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    private static string NormalizeEmail(string email) =>
        email.Trim().ToLowerInvariant();
}
