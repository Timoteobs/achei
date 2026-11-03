using Domain.Modules.Inventory.Entities;
using Domain.Modules.Spaces.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Inventory;

public class TagConfiguration : IEntityTypeConfiguration<Tag>
{
    public void Configure(EntityTypeBuilder<Tag> entity)
    {
        entity.ToTable("tbl_tag");

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

        entity.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(50)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.Color)
            .HasColumnName("color")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.HasIndex(e => new { e.SpaceId, e.Name }).IsUnique();

        entity.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime2")
            .IsRequired();
    }
}
