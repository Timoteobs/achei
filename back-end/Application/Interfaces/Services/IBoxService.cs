using Application.Models.Boxes;

namespace Application.Interfaces.Services;

public interface IBoxService
{
    Task<IReadOnlyList<BoxResponse>> ListAsync(long spaceId, long userId, CancellationToken cancellationToken = default);
    Task<BoxResponse> GetByIdAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default);
    Task<BoxResponse> UpdateAsync(long id, long spaceId, long userId, UpdateBoxRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default);
    Task<BoxResponse> CreateAsync(long spaceId, long userId, CreateBoxRequest request, CancellationToken cancellationToken = default);
}
