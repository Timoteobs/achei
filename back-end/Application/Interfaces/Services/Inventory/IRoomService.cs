using Application.Models.Rooms;

namespace Application.Interfaces.Services.Inventory;

public interface IRoomService
{
    Task<IReadOnlyList<RoomResponse>> ListAsync(long spaceId, long userId, CancellationToken cancellationToken = default);
    Task<RoomResponse> GetByIdAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default);
    Task<RoomResponse> CreateAsync(long spaceId, long userId, SaveRoomRequest request, CancellationToken cancellationToken = default);
    Task<RoomResponse> UpdateAsync(long id, long spaceId, long userId, SaveRoomRequest request, CancellationToken cancellationToken = default);
    Task DeleteAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default);
}
