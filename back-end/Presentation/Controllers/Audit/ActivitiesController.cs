using Achei.Extensions;
using Application.Interfaces.Services.Audit;
using Application.Models.Activities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Achei.Controllers.Audit;

[ApiController]
[Authorize]
[Route("api/spaces/{spaceId:long}/activities")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
[ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
public sealed class ActivitiesController(IActivityService activities) : ControllerBase
{
    [HttpGet("indicators")]
    [ProducesResponseType<ActivityIndicatorsResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ActivityIndicatorsResponse>> GetIndicatorsAsync(long spaceId, [FromQuery] GetActivityIndicatorsRequest request, CancellationToken cancellationToken = default)
    {
        return Ok(await activities.GetIndicatorsAsync(spaceId, User.GetUserId(), request, cancellationToken));
    }

    [HttpGet]
    [ProducesResponseType<ActivitiesPageResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ActivitiesPageResponse>> ListAsync(long spaceId, [FromQuery] ListActivitiesRequest request, CancellationToken cancellationToken = default)
    {
        return Ok(await activities.ListAsync(spaceId, User.GetUserId(), request, cancellationToken));
    }
}
