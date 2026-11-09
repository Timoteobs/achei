using Application.Models.Boxes;

namespace Application.Interfaces.Services;

public interface IBoxService
{
    Task<IReadOnlyList<BoxResponse>> ListAsync(long spaceId, long userId, CancellationToken cancellationToken = default);
    Task<BoxResponse> CreateAsync(long spaceId, long userId, CreateBoxRequest request, CancellationToken cancellationToken = default);
}
