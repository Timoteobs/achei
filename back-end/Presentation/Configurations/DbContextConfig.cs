using Data.Context;
using Microsoft.EntityFrameworkCore;

namespace Achei.Configurations;

public static class DbContextConfig
{
    public static IServiceCollection AddDbContextConfig(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AcheiContext>(options =>
            options.UseSqlServer(
                GetConnectionString(configuration),
                sqlOptions =>
                {
                    sqlOptions.CommandTimeout(90);
                    sqlOptions.EnableRetryOnFailure(
                        maxRetryCount: 10,
                        maxRetryDelay: TimeSpan.FromSeconds(30),
                        errorNumbersToAdd: null);
                }));

        return services;
    }

    private static string GetConnectionString(IConfiguration configuration)
    {
        return configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' não encontrada.");
    }
}
