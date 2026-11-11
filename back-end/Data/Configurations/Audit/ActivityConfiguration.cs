using Domain.Modules.Audit.Entities;
using Domain.Modules.Identity.Entities;
using Domain.Modules.Spaces.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Audit;

public class ActivityConfiguration : IEntityTypeConfiguration<Activity>
{
    public void Configure(EntityTypeBuilder<Activity> entity)
    {
        entity.ToTable("tbl_activity");

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
            .OnDelete(DeleteBehavior.Cascade);

        entity.Property(e => e.UserId)
            .HasColumnName("user_id");

        entity.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        entity.Property(e => e.Action)
            .HasColumnName("action")
            .HasMaxLength(50)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.EntityType)
            .HasColumnName("entity_type")
            .HasMaxLength(30)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.EntityId)
            .HasColumnName("entity_id");

        entity.Property(e => e.Metadata)
            .HasColumnName("metadata")
            .HasColumnType("nvarchar(max)");

        entity.HasIndex(e => e.SpaceId);
        entity.HasIndex(e => e.UserId);
        entity.HasIndex(e => new { e.SpaceId, e.CreatedAt });

        entity.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime2")
            .IsRequired();
    }
}
