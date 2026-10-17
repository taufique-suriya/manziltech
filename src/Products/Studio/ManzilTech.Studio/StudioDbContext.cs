using Microsoft.EntityFrameworkCore;

namespace ManzilTech.Studio;

// Internal so no other module can reach this module's tables.
internal sealed class StudioDbContext(DbContextOptions<StudioDbContext> options) : DbContext(options)
{
    public const string Schema = "studio";

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);
    }
}
