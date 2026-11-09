using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.Interfaces.Services;
using Application.Models.Items;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Achei.Controllers.Items;

[ApiController]
[Authorize]
[Route("api/spaces/{spaceId:long}/items")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
public sealed class ItemsController(IItemService items) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<ItemResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ItemResponse>> Create(long spaceId, CreateItemRequest request, CancellationToken cancellationToken)
    {
        var response = await items.CreateAsync(spaceId, GetUserId(), request, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, response);
    }

    private long GetUserId()
    {
        var subject = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!long.TryParse(subject, NumberStyles.None, CultureInfo.InvariantCulture, out var userId) || userId <= 0)
            throw new UnauthorizedAccessException("Token sem identificação válida de usuário.");

        return userId;
    }
}
