using Domain.Modules.Identity.Entities;
using Domain.Modules.Inventory.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Inventory;

public class ItemConfiguration : IEntityTypeConfiguration<Item>
{
    public void Configure(EntityTypeBuilder<Item> entity)
    {
        entity.ToTable("item");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        entity.Property(e => e.LocationId)
            .HasColumnName("location_id")
            .IsRequired();

        entity.HasOne<Location>()
            .WithMany()
            .HasForeignKey(e => e.LocationId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.Property(e => e.CategoryId)
            .HasColumnName("category_id");

        entity.HasOne<Category>()
            .WithMany()
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.Property(e => e.CreatedByUserId)
            .HasColumnName("created_by_user_id");

        entity.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.CreatedByUserId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(150)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(1000)
            .IsUnicode(false);

        entity.Property(e => e.Quantity)
            .HasColumnName("quantity")
            .HasDefaultValue(1)
            .IsRequired();

        entity.Property(e => e.Notes)
            .HasColumnName("notes")
            .HasMaxLength(1000)
            .IsUnicode(false);

        entity.HasIndex(e => e.LocationId);
        entity.HasIndex(e => e.CategoryId);
        entity.HasIndex(e => e.Name);

        entity.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime2")
            .IsRequired();

        entity.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("datetime2")
            .IsRequired();
    }
}
