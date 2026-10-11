using Domain.Modules.Inventory.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Inventory;

public class ItemImageConfiguration : IEntityTypeConfiguration<ItemImage>
{
    public void Configure(EntityTypeBuilder<ItemImage> entity)
    {
        entity.ToTable("item_image");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        entity.Property(e => e.ItemId)
            .HasColumnName("item_id")
            .IsRequired();

        entity.HasOne<Item>()
            .WithMany()
            .HasForeignKey(e => e.ItemId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.HasIndex(e => e.ItemId);

        entity.Property(e => e.Url)
            .HasColumnName("url")
            .HasMaxLength(1000)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.Position)
            .HasColumnName("position")
            .HasDefaultValue(0)
            .IsRequired();

        entity.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime2")
            .IsRequired();
    }
}
