using Application.Interfaces.Security;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Services.Auth;
using Application.Services.Spaces;
using Application.Services.Rooms;
using Achei.Configurations;
using Achei.ExceptionHandling;
using Crosscutting.Common.Core.Security;
using Data.Repositories.Identity;
using Data.Repositories.Spaces;
using Data.Repositories.Inventory;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddDbContextConfig(builder.Configuration);
builder.Services.AddJwtConfig(builder.Configuration);
builder.Services.AddSingleton<IEncryptionService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var keyBase64 = configuration["Encryption:Key"];

    if (string.IsNullOrWhiteSpace(keyBase64))
        throw new InvalidOperationException("Chave de criptografia não configurada.");

    return new AesEncryption(Convert.FromBase64String(keyBase64));
});
builder.Services.AddSingleton<IPasswordHasherService, Argon2PasswordHasher>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISpaceRepository, SpaceRepository>();
builder.Services.AddScoped<ISpaceService, SpaceService>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IRoomService, RoomService>();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
