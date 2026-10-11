using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Inventory.Entities;

public class ItemTag : BaseEntity
{
    public long ItemId { get; private set; }
    public long TagId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private ItemTag() { }

    public ItemTag(long itemId, long tagId)
    {
        DomainValidator.Validator(
            ValidationRule.Positive(itemId, "Item"),
            ValidationRule.Positive(tagId, "Tag")
        );

        ItemId = itemId;
        TagId = tagId;
        CreatedAt = DateTime.UtcNow;
    }
}
