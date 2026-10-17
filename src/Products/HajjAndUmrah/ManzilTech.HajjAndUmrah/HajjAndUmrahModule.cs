using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ManzilTech.HajjAndUmrah;

public static class HajjAndUmrahModule
{
    public static IServiceCollection AddHajjAndUmrahModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<HajjAndUmrahDbContext>(options => options.UseSqlServer(
            configuration.GetConnectionString("ManzilTech"),
            sql => sql.MigrationsHistoryTable("__EFMigrationsHistory", HajjAndUmrahDbContext.Schema)));

        return services;
    }
}
