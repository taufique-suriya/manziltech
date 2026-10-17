using Microsoft.EntityFrameworkCore;

namespace ManzilTech.Bookings;

// Internal so no other module can reach this module's tables.
internal sealed class BookingsDbContext(DbContextOptions<BookingsDbContext> options) : DbContext(options)
{
    public const string Schema = "bookings";

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schema);
    }
}
