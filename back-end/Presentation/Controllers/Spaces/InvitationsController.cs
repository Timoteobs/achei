using Achei.Extensions;
using Application.Interfaces.Services.Spaces;
using Application.Models.Invitations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Achei.Controllers.Spaces;

[ApiController]
[Authorize]
[Route("api/spaces/{spaceId:long}/invitations")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
public sealed class InvitationsController(IInvitationService invitations) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<InvitationResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<InvitationResponse>>> List(long spaceId, CancellationToken cancellationToken)
    {
        return Ok(await invitations.ListAsync(spaceId, User.GetUserId(), cancellationToken));
    }

    [HttpGet("{id:long}")]
    [ProducesResponseType<InvitationResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<InvitationResponse>> GetById(long spaceId, long id, CancellationToken cancellationToken)
    {
        return Ok(await invitations.GetByIdAsync(id, spaceId, User.GetUserId(), cancellationToken));
    }

    [HttpPost]
    [ProducesResponseType<InvitationResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<InvitationResponse>> Create(long spaceId, SaveInvitationRequest request, CancellationToken cancellationToken)
    {
        var response = await invitations.CreateAsync(spaceId, User.GetUserId(), request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { spaceId, id = response.Id }, response);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType<InvitationResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<InvitationResponse>> Update(long spaceId, long id, SaveInvitationRequest request, CancellationToken cancellationToken)
    {
        return Ok(await invitations.UpdateAsync(id, spaceId, User.GetUserId(), request, cancellationToken));
    }

    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(long spaceId, long id, CancellationToken cancellationToken)
    {
        await invitations.DeleteAsync(id, spaceId, User.GetUserId(), cancellationToken);
        return NoContent();
    }
}
