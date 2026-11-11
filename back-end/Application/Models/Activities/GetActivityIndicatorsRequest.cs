using System.ComponentModel.DataAnnotations;

namespace Application.Models.Activities;

public sealed class GetActivityIndicatorsRequest : IValidatableObject
{
    public DateTimeOffset? PeriodStart { get; init; }
    public DateTimeOffset? PeriodEnd { get; init; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (PeriodStart.HasValue != PeriodEnd.HasValue)
        {
            yield return new ValidationResult("Informe o início e o fim do período.", new[] { nameof(PeriodStart), nameof(PeriodEnd) });
            yield break;
        }

        if (PeriodStart is DateTimeOffset start && PeriodEnd is DateTimeOffset end && start >= end)
        {
            yield return new ValidationResult("O início do período deve ser anterior ao fim.", new[] { nameof(PeriodStart), nameof(PeriodEnd) });
        }
    }
}
