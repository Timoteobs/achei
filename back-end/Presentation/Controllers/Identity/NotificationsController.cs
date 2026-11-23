using Achei.Extensions;
using Application.Interfaces.Services.Identity;
using Application.Models.Notifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Achei.Controllers.Identity;

[ApiController]
[Authorize]
[Route("api/notifications")]
[ProducesResponseType(StatusCodes.Status401Unauthorized)]
public sealed class NotificationsController(INotificationService notifications) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<NotificationsPageResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<NotificationsPageResponse>> ListAsync([FromQuery] ListNotificationsRequest request, CancellationToken cancellationToken)
    {
        return Ok(await notifications.ListAsync(User.GetUserId(), request, cancellationToken));
    }

    [HttpPut("{id:long}/read")]
    [ProducesResponseType<NotificationResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<NotificationResponse>> MarkAsReadAsync(long id, CancellationToken cancellationToken)
    {
        return Ok(await notifications.MarkAsReadAsync(id, User.GetUserId(), cancellationToken));
    }
}
