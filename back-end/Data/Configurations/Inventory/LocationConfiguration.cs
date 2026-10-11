using Domain.Modules.Identity.Entities;
using Domain.Modules.Inventory.Entities;
using Domain.Modules.Spaces.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Inventory;

public class LocationConfiguration : IEntityTypeConfiguration<Location>
{
    public void Configure(EntityTypeBuilder<Location> entity)
    {
        entity.ToTable("location");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        entity.Property(e => e.SpaceId)
            .HasColumnName("space_id")
            .IsRequired();

        entity.HasOne<Space>()
            .WithMany()
            .HasForeignKey(e => e.SpaceId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.Property(e => e.ParentLocationId)
            .HasColumnName("parent_location_id");

        entity.HasOne<Location>()
            .WithMany()
            .HasForeignKey(e => e.ParentLocationId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.Property(e => e.CreatedByUserId)
            .HasColumnName("created_by_user_id");

        entity.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.CreatedByUserId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(100)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.Type)
            .HasColumnName("type")
            .HasMaxLength(30)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(500)
            .IsUnicode(false);

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

        entity.Property(e => e.QrCode)
            .HasColumnName("qr_code")
            .HasMaxLength(255)
            .IsUnicode(false);

        entity.HasIndex(e => e.QrCode).IsUnique();
        entity.HasIndex(e => e.SpaceId);
        entity.HasIndex(e => e.ParentLocationId);
        entity.HasIndex(e => new { e.SpaceId, e.ParentLocationId });

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
