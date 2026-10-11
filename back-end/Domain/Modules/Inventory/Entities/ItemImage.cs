using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Inventory.Entities;

public class ItemImage : BaseEntity
{
    public long ItemId { get; private set; }
    public string Url { get; private set; } = string.Empty;
    public int Position { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private ItemImage() { }

    public ItemImage(long itemId, string url, int position = 0)
    {
        DomainValidator.Validator(
            ValidationRule.Positive(itemId, "Item"),
            ValidationRule.Required(url, "URL"),
            ValidationRule.MaxLength(url, 1000, "URL"),
            ValidationRule.NonNegative(position, "Posição")
        );

        ItemId = itemId;
        Url = url.Trim();
        Position = position;
        CreatedAt = DateTime.UtcNow;
    }
}
