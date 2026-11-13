using Achei.Extensions;
using Application.Interfaces.Services.Inventory;
using Application.Models.Items;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Achei.Controllers.Inventory;

[ApiController]
[Authorize]
[Route("api/spaces/{spaceId:long}/items")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
public sealed class ItemsController(IItemService items) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<ItemsPageResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ItemsPageResponse>> List(long spaceId, [FromQuery] ListItemsRequest request, CancellationToken cancellationToken)
    {
        return Ok(await items.ListAsync(spaceId, User.GetUserId(), request, cancellationToken));
    }

    [HttpGet("recent")]
    [ProducesResponseType<RecentItemsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RecentItemsResponse>> ListRecentAsync(long spaceId, [FromQuery] ListRecentItemsRequest request, CancellationToken cancellationToken)
    {
        return Ok(await items.ListRecentAsync(spaceId, User.GetUserId(), request, cancellationToken));
    }

    [HttpGet("{id:long}")]
    [ProducesResponseType<ItemResponse>(StatusCodes.Status200OK)]
    public async Task<ActionResult<ItemResponse>> GetById(long spaceId, long id, CancellationToken cancellationToken)
    {
        return Ok(await items.GetByIdAsync(id, spaceId, User.GetUserId(), cancellationToken));
    }

    [HttpPost]
    [ProducesResponseType<ItemResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ItemResponse>> Create(long spaceId, CreateItemRequest request, CancellationToken cancellationToken)
    {
        var response = await items.CreateAsync(spaceId, User.GetUserId(), request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { spaceId, id = response.Id }, response);
    }

    [HttpPut("{id:long}")]
    [ProducesResponseType<ItemResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ItemResponse>> Update(long spaceId, long id, UpdateItemRequest request, CancellationToken cancellationToken)
    {
        return Ok(await items.UpdateAsync(id, spaceId, User.GetUserId(), request, cancellationToken));
    }

    [HttpDelete("{id:long}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(long spaceId, long id, CancellationToken cancellationToken)
    {
        await items.DeleteAsync(id, spaceId, User.GetUserId(), cancellationToken);
        return NoContent();
    }
}
