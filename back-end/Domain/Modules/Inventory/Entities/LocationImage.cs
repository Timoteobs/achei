using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Inventory.Entities;

public class LocationImage : BaseEntity
{
    public long LocationId { get; private set; }
    public string Url { get; private set; } = string.Empty;
    public int Position { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private LocationImage() { }

    public LocationImage(long locationId, string url, int position = 0)
    {
        DomainValidator.Validator(
            ValidationRule.Positive(locationId, "Local"),
            ValidationRule.Required(url, "URL"),
            ValidationRule.MaxLength(url, 1000, "URL"),
            ValidationRule.NonNegative(position, "Posição")
        );

        LocationId = locationId;
        Url = url.Trim();
        Position = position;
        CreatedAt = DateTime.UtcNow;
    }
}
