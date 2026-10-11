using Domain.Modules.Inventory.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Inventory;

public class LocationImageConfiguration : IEntityTypeConfiguration<LocationImage>
{
    public void Configure(EntityTypeBuilder<LocationImage> entity)
    {
        entity.ToTable("location_image");

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

        entity.HasIndex(e => e.LocationId);

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
