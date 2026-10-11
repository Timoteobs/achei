using Domain.Common;
using Domain.Common.Validation;

namespace Domain.Modules.Inventory.Entities;

public class Favorite : BaseEntity
{
    public long UserId { get; private set; }
    public long ItemId { get; private set; }
    public DateTime CreatedAt { get; private set; }

    private Favorite() { }

    public Favorite(long userId, long itemId)
    {
        DomainValidator.Validator(
            ValidationRule.Positive(userId, "Usuário"),
            ValidationRule.Positive(itemId, "Item")
        );

        UserId = userId;
        ItemId = itemId;
        CreatedAt = DateTime.UtcNow;
    }
}
