using Domain.Modules.Audit.Entities;
using Domain.Modules.Identity.Entities;
using Domain.Modules.Inventory.Entities;
using Domain.Modules.Spaces.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Context;

public class AcheiContext : DbContext
{
    public AcheiContext(DbContextOptions<AcheiContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Space> Spaces => Set<Space>();
    public DbSet<Member> Members => Set<Member>();
    public DbSet<Invitation> Invitations => Set<Invitation>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<LocationImage> LocationImages => Set<LocationImage>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<ItemImage> ItemImages => Set<ItemImage>();
    public DbSet<Tag> Tags => Set<Tag>();
    public DbSet<ItemTag> ItemTags => Set<ItemTag>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<Activity> Activities => Set<Activity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AcheiContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
