using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.Interfaces.Services;
using Application.Models.Boxes;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Achei.Controllers.Boxes;

[ApiController]
[Authorize]
[Route("api/spaces/{spaceId:long}/boxes")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
public sealed class BoxesController(IBoxService boxes) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<BoxResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<BoxResponse>>> List(long spaceId, CancellationToken cancellationToken) =>
        Ok(await boxes.ListAsync(spaceId, GetUserId(), cancellationToken));

    [HttpGet("{id:long}")]
    [ProducesResponseType<BoxResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<BoxResponse>> GetById(long spaceId, long id, CancellationToken cancellationToken) =>
        Ok(await boxes.GetByIdAsync(id, spaceId, GetUserId(), cancellationToken));

    [HttpPost]
    [ProducesResponseType<BoxResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BoxResponse>> Create(long spaceId, CreateBoxRequest request, CancellationToken cancellationToken)
    {
        var response = await boxes.CreateAsync(spaceId, GetUserId(), request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { spaceId, id = response.Id }, response);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType<BoxResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<BoxResponse>> Update(long spaceId, long id, UpdateBoxRequest request, CancellationToken cancellationToken) =>
        Ok(await boxes.UpdateAsync(id, spaceId, GetUserId(), request, cancellationToken));

    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(long spaceId, long id, CancellationToken cancellationToken)
    {
        await boxes.DeleteAsync(id, spaceId, GetUserId(), cancellationToken);
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
