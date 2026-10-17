using Microsoft.EntityFrameworkCore;

namespace ManzilTech.Common;

// Internal so no other module can reach this module's tables.
internal sealed class CommonDbContext(DbContextOptions<CommonDbContext> options) : DbContext(options)
{
    public const string Schema = "common";

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);
    }
}
