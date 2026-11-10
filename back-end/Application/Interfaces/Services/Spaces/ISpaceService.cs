using Application.Models.Spaces;

namespace Application.Interfaces.Services.Spaces;

public interface ISpaceService
{
    Task<IReadOnlyList<SpaceResponse>> ListAsync(long userId, CancellationToken cancellationToken = default);
    Task<SpaceResponse> GetByIdAsync(long id, long userId, CancellationToken cancellationToken = default);
    Task<SpaceResponse> CreateAsync(long userId, SaveSpaceRequest request, CancellationToken cancellationToken = default);
    Task<SpaceResponse> UpdateAsync(long id, long userId, SaveSpaceRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(long id, long userId, CancellationToken cancellationToken = default);
}
