using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.Interfaces.Services;
using Application.Models.Rooms;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Achei.Controllers.Rooms;

[ApiController]
[Authorize]
[Route("api/spaces/{spaceId:long}/rooms")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
public sealed class RoomsController(IRoomService rooms) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<RoomResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<RoomResponse>>> List(long spaceId, CancellationToken cancellationToken) =>
        Ok(await rooms.ListAsync(spaceId, GetUserId(), cancellationToken));

    [HttpGet("{id:long}")]
    [ProducesResponseType<RoomResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<RoomResponse>> GetById(long spaceId, long id, CancellationToken cancellationToken) =>
        Ok(await rooms.GetByIdAsync(id, spaceId, GetUserId(), cancellationToken));

    [HttpPost]
    [ProducesResponseType<RoomResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RoomResponse>> Create(long spaceId, SaveRoomRequest request, CancellationToken cancellationToken)
    {
        var response = await rooms.CreateAsync(spaceId, GetUserId(), request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { spaceId, id = response.Id }, response);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType<RoomResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RoomResponse>> Update(long spaceId, long id, SaveRoomRequest request, CancellationToken cancellationToken) =>
        Ok(await rooms.UpdateAsync(id, spaceId, GetUserId(), request, cancellationToken));

    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(long spaceId, long id, CancellationToken cancellationToken)
    {
        await rooms.DeleteAsync(id, spaceId, GetUserId(), cancellationToken);
        return NoContent();
    }

    private long GetUserId()
    {
        var subject = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!long.TryParse(subject, NumberStyles.None, CultureInfo.InvariantCulture, out var userId) || userId <= 0)
            throw new UnauthorizedAccessException("Token sem identificação válida de usuário.");

        return userId;
    }
}
