using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ManzilTech.Bookings;

public static class BookingsModule
{
    public static IServiceCollection AddBookingsModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<BookingsDbContext>(options => options.UseSqlServer(
            configuration.GetConnectionString("ManzilTech"),
            sql => sql.MigrationsHistoryTable("__EFMigrationsHistory", BookingsDbContext.Schema)));

        return services;
    }
}
