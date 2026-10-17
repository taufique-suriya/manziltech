using Microsoft.EntityFrameworkCore;

namespace ManzilTech.HajjAndUmrah;

// Internal so no other module can reach this module's tables.
internal sealed class HajjAndUmrahDbContext(DbContextOptions<HajjAndUmrahDbContext> options) : DbContext(options)
{
    public const string Schema = "hajjandumrah";

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);
    }
}
