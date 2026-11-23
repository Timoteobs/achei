using Domain.Modules.Identity.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Identity;

public sealed class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> entity)
    {
        entity.ToTable("tbl_notification");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        entity.Property(e => e.UserId)
            .HasColumnName("user_id")
            .IsRequired();

        entity.HasOne<User>()
            .WithMany()
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        entity.Property(e => e.Title)
            .HasColumnName("title")
            .HasMaxLength(200)
            .IsRequired();

        entity.Property(e => e.Message)
            .HasColumnName("message")
            .HasMaxLength(4000)
            .IsRequired();

        entity.Property(e => e.Type)
            .HasColumnName("type")
            .HasMaxLength(50)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.ScreenId)
            .HasColumnName("screen_id")
            .HasMaxLength(100)
            .IsUnicode(false);

        entity.Property(e => e.Payload)
            .HasColumnName("payload")
            .HasColumnType("nvarchar(max)");

        entity.Property(e => e.WasRead)
            .HasColumnName("was_read")
            .HasDefaultValue(false)
            .IsRequired();

        entity.Property(e => e.SentAt)
            .HasColumnName("sent_at")
            .HasColumnType("datetime2")
            .IsRequired();

        entity.Property(e => e.ReadAt)
            .HasColumnName("read_at")
            .HasColumnType("datetime2");

        entity.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime2")
            .IsRequired();

        entity.Property(e => e.UpdatedAt)
            .HasColumnName("updated_at")
            .HasColumnType("datetime2");

        entity.HasIndex(e => new { e.UserId, e.SentAt });
        entity.HasIndex(e => new { e.UserId, e.WasRead });
    }
}
