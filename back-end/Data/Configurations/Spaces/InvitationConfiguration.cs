using Domain.Modules.Identity.Entities;
using Domain.Modules.Spaces.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Spaces;

public class InvitationConfiguration : IEntityTypeConfiguration<Invitation>
{
    public void Configure(EntityTypeBuilder<Invitation> entity)
    {
        entity.ToTable("tbl_invitation");

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

        entity.Property(e => e.InvitedByUserId)
            .HasColumnName("invited_by_user_id")
            .IsRequired();

        entity.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.InvitedByUserId)
            .OnDelete(DeleteBehavior.NoAction);

        entity.Property(e => e.Email)
            .HasColumnName("email")
            .HasMaxLength(255)
            .IsUnicode(false);

        entity.HasIndex(e => new { e.SpaceId, e.Email });

        entity.Property(e => e.Token)
            .HasColumnName("token")
            .HasMaxLength(255)
            .IsUnicode(false)
            .IsRequired();

        entity.HasIndex(e => e.Token).IsUnique();

        entity.Property(e => e.Role)
            .HasColumnName("role")
            .HasMaxLength(20)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.Status)
            .HasColumnName("status")
            .HasMaxLength(20)
            .IsUnicode(false)
            .HasDefaultValue("PENDING")
            .IsRequired();

        entity.Property(e => e.ExpiresAt)
            .HasColumnName("expires_at")
            .HasColumnType("datetime2")
            .IsRequired();

        entity.Property(e => e.AcceptedAt)
            .HasColumnName("accepted_at")
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
