using Domain.Modules.Identity.Entities;
using Domain.Modules.Inventory.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Inventory;

public class FavoriteConfiguration : IEntityTypeConfiguration<Favorite>
{
    public void Configure(EntityTypeBuilder<Favorite> entity)
    {
        entity.ToTable("tbl_favorite");
        entity.Ignore(e => e.Id);

        entity.HasKey(e => new { e.UserId, e.ItemId });

        entity.Property(e => e.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        entity.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.Property(e => e.ItemId)
            .HasColumnName("item_id")
            .IsRequired();

        entity.HasOne<Item>()
            .WithMany()
            .HasForeignKey(e => e.ItemId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.HasIndex(e => e.ItemId);

        entity.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime2")
            .IsRequired();
    }
}
