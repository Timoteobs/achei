using Domain.Modules.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Identity;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> entity)
    {
        entity.ToTable("tbl_user");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        entity.Property(e => e.Active)
            .HasColumnName("active")
            .HasDefaultValue(true)
            .IsRequired();

        entity.Property(e => e.Name)
            .HasColumnName("name")
            .HasMaxLength(100)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.Email)
            .HasColumnName("email")
            .HasMaxLength(255)
            .IsUnicode(false)
            .IsRequired();

        entity.HasIndex(e => e.Email).IsUnique();

        entity.Property(e => e.PasswordHash)
            .HasColumnName("password_hash")
            .HasMaxLength(255)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.Phone)
            .HasColumnName("phone")
            .HasMaxLength(20)
            .IsUnicode(false);

        entity.Property(e => e.AvatarUrl)
            .HasColumnName("avatar_url")
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
