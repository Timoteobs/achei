using Achei.Extensions;
using Application.Interfaces.Services.Inventory;
using Application.Models.Rooms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Achei.Controllers.Inventory;

[ApiController]
[Authorize]
[Route("api/spaces/{spaceId:long}/rooms")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
public sealed class RoomsController(IRoomService rooms) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<RoomResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<RoomResponse>>> List(long spaceId, CancellationToken cancellationToken)
    {
        return Ok(await rooms.ListAsync(spaceId, User.GetUserId(), cancellationToken));
    }

    [HttpGet("{id:long}")]
    [ProducesResponseType<RoomResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<RoomResponse>> GetById(long spaceId, long id, CancellationToken cancellationToken)
    {
        return Ok(await rooms.GetByIdAsync(id, spaceId, User.GetUserId(), cancellationToken));
    }

    [HttpPost]
    [ProducesResponseType<RoomResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RoomResponse>> Create(long spaceId, SaveRoomRequest request, CancellationToken cancellationToken)
    {
        var response = await rooms.CreateAsync(spaceId, User.GetUserId(), request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { spaceId, id = response.Id }, response);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType<RoomResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RoomResponse>> Update(long spaceId, long id, SaveRoomRequest request, CancellationToken cancellationToken)
    {
        return Ok(await rooms.UpdateAsync(id, spaceId, User.GetUserId(), request, cancellationToken));
    }

    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(long spaceId, long id, CancellationToken cancellationToken)
    {
        await rooms.DeleteAsync(id, spaceId, User.GetUserId(), cancellationToken);
        return NoContent();
    }
}
