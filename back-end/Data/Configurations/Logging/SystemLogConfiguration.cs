using Data.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Data.Configurations.Logging;

public sealed class SystemLogConfiguration : IEntityTypeConfiguration<SystemLog>
{
    public void Configure(EntityTypeBuilder<SystemLog> entity)
    {
        entity.ToTable("tbl_system_log");

        entity.HasKey(e => e.Id);

        entity.Property(e => e.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();

        entity.Property(e => e.Level)
            .HasColumnName("level")
            .HasMaxLength(20)
            .IsUnicode(false)
            .IsRequired();

        entity.Property(e => e.Category)
            .HasColumnName("category")
            .HasMaxLength(256)
            .IsRequired();

        entity.Property(e => e.EventId)
            .HasColumnName("event_id")
            .IsRequired();

        entity.Property(e => e.Message)
            .HasColumnName("message")
            .HasMaxLength(4000)
            .IsRequired();

        entity.Property(e => e.Exception)
            .HasColumnName("exception")
            .HasColumnType("nvarchar(max)");

        entity.Property(e => e.TraceId)
            .HasColumnName("trace_id")
            .HasMaxLength(32)
            .IsUnicode(false);

        entity.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("datetime2")
            .IsRequired();

        entity.HasIndex(e => e.CreatedAt);
    }
}
