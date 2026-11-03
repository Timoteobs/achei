using Domain.Modules.Identity.Entities;
using Domain.Modules.Spaces.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Spaces;

public class MemberConfiguration : IEntityTypeConfiguration<Member>
{
    public void Configure(EntityTypeBuilder<Member> entity)
    {
        entity.ToTable("tbl_member");

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

        entity.Property(e => e.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        entity.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.HasIndex(e => new { e.SpaceId, e.UserId }).IsUnique();

        entity.Property(e => e.Role)
            .HasColumnName("role")
            .HasMaxLength(20)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.JoinedAt)
            .HasColumnName("joined_at")
            .HasColumnType("datetime2");

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
