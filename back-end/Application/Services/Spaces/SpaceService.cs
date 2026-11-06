using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services;
using Application.Models.Spaces;
using Domain.Modules.Spaces.Entities;

namespace Application.Services.Spaces;

public sealed class SpaceService(ISpaceRepository spaces) : ISpaceService
{
    public async Task<IReadOnlyList<SpaceResponse>> ListAsync(long userId, CancellationToken cancellationToken = default)
    {
        var result = await spaces.ListByOwnerAsync(userId, cancellationToken);
        return result.Select(ToResponse).ToArray();
    }

    public async Task<SpaceResponse> GetByIdAsync(long id, long userId, CancellationToken cancellationToken = default) =>
        ToResponse(await GetOwnedSpaceAsync(id, userId, cancellationToken));

    public async Task<SpaceResponse> CreateAsync(long userId, SaveSpaceRequest request, CancellationToken cancellationToken = default)
    {
        var space = new Space(userId, request.Name, request.Description, request.ImageUrl);
        await spaces.AddAsync(space, cancellationToken);
        return ToResponse(space);
    }

    public async Task<SpaceResponse> UpdateAsync(long id, long userId, SaveSpaceRequest request, CancellationToken cancellationToken = default)
    {
        var space = await GetOwnedSpaceAsync(id, userId, cancellationToken);
        space.Update(request.Name, request.Description, request.ImageUrl);
        await spaces.UpdateAsync(space, cancellationToken);
        return ToResponse(space);
    }

    public async Task DeleteAsync(long id, long userId, CancellationToken cancellationToken = default)
    {
        var space = await GetOwnedSpaceAsync(id, userId, cancellationToken);
        await spaces.DeleteAsync(space, cancellationToken);
    }

    private async Task<Space> GetOwnedSpaceAsync(long id, long userId, CancellationToken cancellationToken) =>
        await spaces.GetByIdAndOwnerAsync(id, userId, cancellationToken) ?? throw new SpaceNotFoundException();

    private static SpaceResponse ToResponse(Space space) => new(
        space.Id,
        space.OwnerUserId,
        space.Name,
        space.Description,
        space.ImageUrl,
        DateTime.SpecifyKind(space.CreatedAt, DateTimeKind.Utc),
        DateTime.SpecifyKind(space.UpdatedAt, DateTimeKind.Utc));
}
