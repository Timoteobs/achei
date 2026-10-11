using Domain.Modules.Identity.Entities;
using Domain.Modules.Spaces.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Spaces;

public class SpaceConfiguration : IEntityTypeConfiguration<Space>
{
    public void Configure(EntityTypeBuilder<Space> entity)
    {
        entity.ToTable("space");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        entity.Property(e => e.OwnerUserId)
            .HasColumnName("owner_user_id")
            .IsRequired();

        entity.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.OwnerUserId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(100)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(500)
            .IsUnicode(false);

        entity.Property(e => e.ImageUrl)
            .HasColumnName("image_url")
            .HasMaxLength(1000)
            .IsUnicode(false);

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
