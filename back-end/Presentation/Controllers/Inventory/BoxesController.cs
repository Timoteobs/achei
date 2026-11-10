using Achei.Extensions;
using Application.Interfaces.Services.Inventory;
using Application.Models.Boxes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Achei.Controllers.Inventory;

[ApiController]
[Authorize]
[Route("api/spaces/{spaceId:long}/boxes")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
public sealed class BoxesController(IBoxService boxes) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<BoxResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<BoxResponse>>> List(long spaceId, CancellationToken cancellationToken)
    {
        return Ok(await boxes.ListAsync(spaceId, User.GetUserId(), cancellationToken));
    }

    [HttpGet("{id:long}")]
    [ProducesResponseType<BoxResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<BoxResponse>> GetById(long spaceId, long id, CancellationToken cancellationToken)
    {
        return Ok(await boxes.GetByIdAsync(id, spaceId, User.GetUserId(), cancellationToken));
    }

    [HttpPost]
    [ProducesResponseType<BoxResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BoxResponse>> Create(long spaceId, CreateBoxRequest request, CancellationToken cancellationToken)
    {
        var response = await boxes.CreateAsync(spaceId, User.GetUserId(), request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { spaceId, id = response.Id }, response);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType<BoxResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BoxResponse>> Update(long spaceId, long id, UpdateBoxRequest request, CancellationToken cancellationToken)
    {
        return Ok(await boxes.UpdateAsync(id, spaceId, User.GetUserId(), request, cancellationToken));
    }

    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(long spaceId, long id, CancellationToken cancellationToken)
    {
        await boxes.DeleteAsync(id, spaceId, User.GetUserId(), cancellationToken);
        return NoContent();
    }
}
