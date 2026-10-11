using Application.Interfaces.Security;
using Achei.Configurations;
using Crosscutting.Common.Core.Security;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
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
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

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
