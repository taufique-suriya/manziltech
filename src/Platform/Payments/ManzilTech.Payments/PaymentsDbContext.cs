using Microsoft.EntityFrameworkCore;

namespace ManzilTech.Payments;

// Internal so no other module can reach this module's tables.
internal sealed class PaymentsDbContext(DbContextOptions<PaymentsDbContext> options) : DbContext(options)
{
    public const string Schema = "payments";

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);
    }
}
