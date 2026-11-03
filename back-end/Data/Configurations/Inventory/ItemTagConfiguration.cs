using Domain.Modules.Inventory.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Inventory;

public class ItemTagConfiguration : IEntityTypeConfiguration<ItemTag>
{
    public void Configure(EntityTypeBuilder<ItemTag> entity)
    {
        entity.ToTable("tbl_item_tag");
        entity.Ignore(e => e.Id);

        entity.HasKey(e => new { e.ItemId, e.TagId });

        entity.Property(e => e.ItemId)
            .HasColumnName("item_id")
            .IsRequired();

        entity.HasOne<Item>()
            .WithMany()
            .HasForeignKey(e => e.ItemId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.Property(e => e.TagId)
            .HasColumnName("tag_id")
            .IsRequired();

        entity.HasOne<Tag>()
            .WithMany()
            .HasForeignKey(e => e.TagId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.HasIndex(e => e.TagId);

        entity.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime2")
            .IsRequired();
    }
}
