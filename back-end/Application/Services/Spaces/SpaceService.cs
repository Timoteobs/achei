using Application.Common.Exceptions;
using Application.Interfaces.Persistence;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services.Audit;
using Application.Interfaces.Services.Spaces;
using Application.Models.Spaces;
using Domain.Modules.Audit;
using Domain.Modules.Spaces.Entities;

namespace Application.Services.Spaces;

public sealed class SpaceService(ISpaceRepository spaces, IMemberRepository members, IActivityService activities, IUnitOfWork unitOfWork) : ISpaceService
{
    #region Service Methods

    public async Task<IReadOnlyList<SpaceResponse>> ListAsync(long userId, CancellationToken cancellationToken = default)
    {
        var result = await spaces.ListByUserAsync(userId, cancellationToken);
        var memberships = (await members.ListByUserAsync(userId, cancellationToken)).ToDictionary(member => member.SpaceId);
        return result.Select(space => ToResponse(space, space.OwnerUserId == userId ? "OWNER" : memberships.GetValueOrDefault(space.Id)?.Role ?? "VIEWER")).ToArray();
    }

    public async Task<SpaceResponse> GetByIdAsync(long id, long userId, CancellationToken cancellationToken = default)
    {
        var space = await spaces.GetByIdAndUserAsync(id, userId, cancellationToken) ?? throw SpacesExceptions.SpaceNotFound();
        var role = space.OwnerUserId == userId ? "OWNER" : (await members.GetBySpaceAndUserAsync(id, userId, cancellationToken))?.Role ?? "VIEWER";
        return ToResponse(space, role);
    }

    public async Task<SpaceResponse> CreateAsync(long userId, SaveSpaceRequest request, CancellationToken cancellationToken = default)
    {
        var space = new Space(userId, request.Name, request.Description, request.ImageUrl);
        await unitOfWork.ExecuteAsync(async transactionCancellationToken =>
        {
            await spaces.AddAsync(space, transactionCancellationToken);
            await activities.LogAsync(space.Id, userId, ActivityActions.Created, ActivityEntityTypes.Space, space.Id, new { space.Name }, transactionCancellationToken);
        }, cancellationToken);

        return ToResponse(space, "OWNER");
    }

    public async Task<SpaceResponse> UpdateAsync(long id, long userId, SaveSpaceRequest request, CancellationToken cancellationToken = default)
    {
        var space = await GetOwnedSpaceAsync(id, userId, cancellationToken);
        space.Update(request.Name, request.Description, request.ImageUrl);
        await unitOfWork.ExecuteAsync(async transactionCancellationToken =>
        {
            await spaces.UpdateAsync(space, transactionCancellationToken);
            await activities.LogAsync(space.Id, userId, ActivityActions.Updated, ActivityEntityTypes.Space, space.Id, new { space.Name }, transactionCancellationToken);
        }, cancellationToken);

        return ToResponse(space, "OWNER");
    }

    public async Task DeleteAsync(long id, long userId, CancellationToken cancellationToken = default)
    {
        var space = await GetOwnedSpaceAsync(id, userId, cancellationToken);
        await spaces.DeleteAsync(space, cancellationToken);
    }

    #endregion

    #region Helper Methods

    private async Task<Space> GetOwnedSpaceAsync(long id, long userId, CancellationToken cancellationToken)
    {
        return await spaces.GetByIdAndOwnerAsync(id, userId, cancellationToken) ?? throw SpacesExceptions.SpaceNotFound();
    }

    private static SpaceResponse ToResponse(Space space, string role)
    {
        return new SpaceResponse(space.Id, space.OwnerUserId, space.Name, space.Description, space.ImageUrl, DateTime.SpecifyKind(space.CreatedAt, DateTimeKind.Utc), DateTime.SpecifyKind(space.UpdatedAt, DateTimeKind.Utc), role);
    }

    #endregion
}
