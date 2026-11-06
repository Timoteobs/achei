using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text.Json;
using Achei.Configurations;
using Achei.Controllers.Spaces;
using Achei.ExceptionHandling;
using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Security;
using Application.Interfaces.Services;
using Application.Models.Spaces;
using Application.Services.Spaces;
using Domain.Common;
using Domain.Modules.Spaces.Entities;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

// Usa o controller, o serviço e a autenticação reais, com armazenamento isolado em memória.
var builder = WebApplication.CreateBuilder(new WebApplicationOptions { EnvironmentName = "Testing" });
builder.Logging.ClearProviders();
builder.Configuration.AddInMemoryCollection(new Dictionary<string, string?>
{
    ["Jwt:Key"] = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32)),
    ["Jwt:Issuer"] = "Achei.SpacesChecks",
    ["Jwt:Audience"] = "Achei.SpacesChecks",
    ["Jwt:ExpirationMinutes"] = "5"
});
builder.Services.AddJwtConfig(builder.Configuration);
builder.Services.AddControllers().AddApplicationPart(typeof(SpacesController).Assembly);
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
var repository = new MemorySpaceRepository();
builder.Services.AddSingleton<ISpaceRepository>(repository);
builder.Services.AddScoped<ISpaceService, SpaceService>();

await using var app = builder.Build();
app.Urls.Add("http://127.0.0.1:0");
app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
await app.StartAsync();

try
{
    using var client = new HttpClient { BaseAddress = new Uri(app.Urls.Single()) };
    var tokens = app.Services.GetRequiredService<IJwtTokenService>();
    var ownerToken = tokens.Generate(1, "Proprietário", "owner@example.test").AccessToken;
    var otherToken = tokens.Generate(2, "Outro usuário", "other@example.test").AccessToken;
    var request = new { name = " Minha Casa ", description = " Descrição ", imageUrl = (string?)null, ownerUserId = 2 };

    foreach (var (method, path) in new[]
    {
        (HttpMethod.Get, "/api/spaces"),
        (HttpMethod.Get, "/api/spaces/1"),
        (HttpMethod.Post, "/api/spaces"),
        (HttpMethod.Put, "/api/spaces/1"),
        (HttpMethod.Delete, "/api/spaces/1")
    })
        await Send(method, path, HttpStatusCode.Unauthorized, body: request);

    await Send(HttpMethod.Get, "/api/spaces", HttpStatusCode.Unauthorized, "invalid-token");
    var createdJson = await Send(HttpMethod.Post, "/api/spaces", HttpStatusCode.Created, ownerToken, request);
    var created = JsonSerializer.Deserialize<SpaceResponse>(createdJson, JsonSerializerOptions.Web)!;
    Check(created.OwnerUserId == 1 && created.Name == "Minha Casa", "Proprietário deve vir do JWT; nome deve ser normalizado.");
    var pathById = $"/api/spaces/{created.Id}";

    var ownList = JsonSerializer.Deserialize<SpaceResponse[]>(
        await Send(HttpMethod.Get, "/api/spaces", HttpStatusCode.OK, ownerToken), JsonSerializerOptions.Web)!;
    Check(ownList.Length == 1 && ownList[0].Id == created.Id, "Listagem deve incluir o espaço do proprietário.");

    var otherList = JsonSerializer.Deserialize<SpaceResponse[]>(
        await Send(HttpMethod.Get, "/api/spaces", HttpStatusCode.OK, otherToken), JsonSerializerOptions.Web)!;
    Check(otherList.Length == 0, "Listagem não deve expor espaços de outro usuário.");
    foreach (var method in new[] { HttpMethod.Get, HttpMethod.Put, HttpMethod.Delete })
        await Send(method, pathById, HttpStatusCode.NotFound, otherToken, method == HttpMethod.Put ? request : null);

    await Send(HttpMethod.Post, "/api/spaces", HttpStatusCode.BadRequest, ownerToken, new { name = " " });
    await Send(HttpMethod.Put, pathById, HttpStatusCode.BadRequest, ownerToken, new { name = new string('x', 101) });
    await Send(HttpMethod.Post, "/api/spaces", HttpStatusCode.BadRequest, ownerToken,
        new { name = "Casa", imageUrl = "not-a-url" });

    var updated = JsonSerializer.Deserialize<SpaceResponse>(
        await Send(HttpMethod.Put, pathById, HttpStatusCode.OK, ownerToken,
            new { name = "Casa atualizada", description = (string?)null, imageUrl = (string?)null }),
        JsonSerializerOptions.Web)!;
    Check(updated.OwnerUserId == 1 && updated.Name == "Casa atualizada" && updated.Description is null,
        "Atualização deve manter o proprietário e substituir os campos editáveis.");
    Check(updated.CreatedAt == created.CreatedAt && updated.UpdatedAt >= created.UpdatedAt,
        "Atualização deve preservar a data de criação.");
    await Send(HttpMethod.Get, pathById, HttpStatusCode.OK, ownerToken);

    repository.BlockDeletion = true;
    await Send(HttpMethod.Delete, pathById, HttpStatusCode.Conflict, ownerToken);
    await Send(HttpMethod.Get, pathById, HttpStatusCode.OK, ownerToken);
    repository.BlockDeletion = false;
    await Send(HttpMethod.Delete, pathById, HttpStatusCode.NoContent, ownerToken);
    foreach (var method in new[] { HttpMethod.Get, HttpMethod.Put, HttpMethod.Delete })
        await Send(method, pathById, HttpStatusCode.NotFound, ownerToken, method == HttpMethod.Put ? request : null);

    Console.WriteLine("OK: JWT obrigatório, token inválido, isolamento entre usuários, CRUD, validação e conflito de exclusão.");

    async Task<string> Send(HttpMethod method, string path, HttpStatusCode expected, string? token = null, object? body = null)
    {
        using var message = new HttpRequestMessage(method, path);
        if (token is not null) message.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        if (body is not null) message.Content = JsonContent.Create(body);
        using var response = await client.SendAsync(message);
        var content = await response.Content.ReadAsStringAsync();
        Check(response.StatusCode == expected, $"{method} {path}: esperado {(int)expected}, recebido {(int)response.StatusCode}. {content}");
        if (response.StatusCode == HttpStatusCode.Created)
            Check(response.Headers.Location?.ToString().Contains("/api/spaces/") == true, "Criação deve retornar Location.");
        return content;
    }
}
finally
{
    await app.StopAsync();
}

static void Check(bool condition, string message)
{
    if (!condition) throw new InvalidOperationException(message);
}

sealed class MemorySpaceRepository : ISpaceRepository
{
    private readonly Dictionary<long, Space> spaces = [];
    private long nextId;
    public bool BlockDeletion { get; set; }

    public Task<IReadOnlyList<Space>> ListByOwnerAsync(long ownerUserId, CancellationToken cancellationToken = default) =>
        Task.FromResult<IReadOnlyList<Space>>(spaces.Values.Where(space => space.OwnerUserId == ownerUserId).ToArray());

    public Task<Space?> GetByIdAndOwnerAsync(long id, long ownerUserId, CancellationToken cancellationToken = default) =>
        Task.FromResult(spaces.GetValueOrDefault(id) is { } space && space.OwnerUserId == ownerUserId ? space : null);

    public Task AddAsync(Space space, CancellationToken cancellationToken = default)
    {
        typeof(BaseEntity).GetProperty(nameof(BaseEntity.Id))!.SetValue(space, ++nextId);
        spaces.Add(space.Id, space);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Space space, CancellationToken cancellationToken = default) => Task.CompletedTask;

    public Task DeleteAsync(Space space, CancellationToken cancellationToken = default)
    {
        if (BlockDeletion) throw new SpaceHasDependenciesException();
        spaces.Remove(space.Id);
        return Task.CompletedTask;
    }
}
