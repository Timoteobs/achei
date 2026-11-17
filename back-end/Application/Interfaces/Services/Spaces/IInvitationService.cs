using Application.Models.Invitations;

namespace Application.Interfaces.Services.Spaces;

public interface IInvitationService
{
    Task<IReadOnlyList<ReceivedInvitationResponse>> ListReceivedAsync(long userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<InvitationResponse>> ListAsync(long spaceId, long userId, CancellationToken cancellationToken = default);
    Task<InvitationResponse> GetByIdAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default);
    Task<InvitationResponse> CreateAsync(long spaceId, long userId, SaveInvitationRequest request, CancellationToken cancellationToken = default);
    Task<InvitationResponse> UpdateAsync(long id, long spaceId, long userId, SaveInvitationRequest request, CancellationToken cancellationToken = default);
    Task<InvitationDecisionResponse> AcceptAsync(long id, long userId, CancellationToken cancellationToken = default);
    Task<InvitationDecisionResponse> DeclineAsync(long id, long userId, CancellationToken cancellationToken = default);
    Task<InvitationResponse> RevokeAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default);
    Task DeleteAsync(long id, long spaceId, long userId, CancellationToken cancellationToken = default);
}
