using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.Interfaces.Services;
using Application.Models.Spaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Achei.Controllers.Spaces;

[ApiController]
[Authorize]
[Route("api/spaces")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public sealed class SpacesController(ISpaceService spaces) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<IReadOnlyList<SpaceResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<SpaceResponse>>> List(CancellationToken cancellationToken) =>
        Ok(await spaces.ListAsync(GetUserId(), cancellationToken));

    [HttpGet("{id:long}")]
    [ProducesResponseType<SpaceResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SpaceResponse>> GetById(long id, CancellationToken cancellationToken) =>
        Ok(await spaces.GetByIdAsync(id, GetUserId(), cancellationToken));

    [HttpPost]
    [ProducesResponseType<SpaceResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SpaceResponse>> Create(SaveSpaceRequest request, CancellationToken cancellationToken)
    {
        var response = await spaces.CreateAsync(GetUserId(), request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType<SpaceResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SpaceResponse>> Update(long id, SaveSpaceRequest request, CancellationToken cancellationToken) =>
        Ok(await spaces.UpdateAsync(id, GetUserId(), request, cancellationToken));

    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(long id, CancellationToken cancellationToken)
    {
        await spaces.DeleteAsync(id, GetUserId(), cancellationToken);
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
