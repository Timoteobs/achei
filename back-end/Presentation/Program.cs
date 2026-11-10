using Application.Interfaces.Security;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services.Identity;
using Application.Interfaces.Services.Inventory;
using Application.Interfaces.Services.Spaces;
using Achei.Configurations;
using Achei.ExceptionHandling;
using Crosscutting.Common.Core.Security;
using Data.Repositories.Identity;
using Data.Repositories.Spaces;
using Data.Repositories.Inventory;
using Application.Services.Identity;
using Application.Services.Inventory;
using Application.Services.Spaces;

var builder = WebApplication.CreateBuilder(args);

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
    {
        throw new InvalidOperationException("Chave de criptografia não configurada.");
    }

    return new AesEncryption(Convert.FromBase64String(keyBase64));
});
builder.Services.AddSingleton<IPasswordHasherService, Argon2PasswordHasher>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISpaceRepository, SpaceRepository>();
builder.Services.AddScoped<ISpaceService, SpaceService>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IRoomService, RoomService>();
builder.Services.AddScoped<IBoxRepository, BoxRepository>();
builder.Services.AddScoped<IBoxService, BoxService>();
builder.Services.AddScoped<IItemRepository, ItemRepository>();
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
