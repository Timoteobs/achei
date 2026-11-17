using Achei.Extensions;
using Application.Interfaces.Services.Spaces;
using Application.Models.Invitations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Achei.Controllers.Spaces;

[ApiController]
[Authorize]
[Route("api/invitations/received")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public sealed class ReceivedInvitationsController(IInvitationService invitations) : ControllerBase
{
    [HttpPost("{id:long}/accept")]
    [ProducesResponseType<InvitationDecisionResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<InvitationDecisionResponse>> Accept(long id, CancellationToken cancellationToken)
    {
        return Ok(await invitations.AcceptAsync(id, User.GetUserId(), cancellationToken));
    }

    [HttpPost("{id:long}/decline")]
    [ProducesResponseType<InvitationDecisionResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<InvitationDecisionResponse>> Decline(long id, CancellationToken cancellationToken)
    {
        return Ok(await invitations.DeclineAsync(id, User.GetUserId(), cancellationToken));
    }

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<ReceivedInvitationResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ReceivedInvitationResponse>>> List(CancellationToken cancellationToken)
    {
        return Ok(await invitations.ListReceivedAsync(User.GetUserId(), cancellationToken));
    }
}
