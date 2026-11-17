using Application.Common.Exceptions;
using Application.Interfaces.Repositories;
using Application.Interfaces.Services.Spaces;
using Domain.Modules.Spaces.Entities;

namespace Application.Services.Spaces;

public sealed class SpaceAccessService(ISpaceRepository spaces, IMemberRepository members) : ISpaceAccessService
{
    #region Service Methods

    public async Task EnsureCanReadAsync(long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        await GetAccessibleSpaceAsync(spaceId, userId, cancellationToken);
    }

    public async Task EnsureCanEditAsync(long spaceId, long userId, CancellationToken cancellationToken = default)
    {
        var space = await GetAccessibleSpaceAsync(spaceId, userId, cancellationToken);
        if (space.OwnerUserId == userId)
        {
            return;
        }

        var member = await members.GetBySpaceAndUserAsync(spaceId, userId, cancellationToken);
        if (member?.Role != "EDITOR")
        {
            throw SpacesExceptions.ReadOnlyAccess();
        }
    }

    #endregion

    #region Helper Methods

    private async Task<Space> GetAccessibleSpaceAsync(long spaceId, long userId, CancellationToken cancellationToken)
    {
        return await spaces.GetByIdAndUserAsync(spaceId, userId, cancellationToken) ?? throw SpacesExceptions.SpaceNotFound();
    }

    #endregion
}
