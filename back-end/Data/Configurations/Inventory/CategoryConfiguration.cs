using Domain.Modules.Inventory.Entities;
using Domain.Modules.Spaces.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Inventory;

public class CategoryConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> entity)
    {
        entity.ToTable("category");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        entity.Property(e => e.SpaceId)
            .HasColumnName("space_id");

        entity.HasOne<Space>()
            .WithMany()
            .HasForeignKey(e => e.SpaceId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.HasIndex(e => e.SpaceId);

        entity.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(50)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.Icon)
            .HasColumnName("icon")
            .HasMaxLength(100)
            .IsUnicode(false);

        entity.Property(e => e.Color)
            .HasColumnName("color")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.Position)
            .HasColumnName("position")
            .HasDefaultValue(0)
            .IsRequired();

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
