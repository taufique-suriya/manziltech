using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ManzilTech.Payments;

public static class PaymentsModule
{
    public static IServiceCollection AddPaymentsModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<PaymentsDbContext>(options => options.UseSqlServer(
            configuration.GetConnectionString("ManzilTech"),
            sql => sql.MigrationsHistoryTable("__EFMigrationsHistory", PaymentsDbContext.Schema)));

        return services;
    }
}
