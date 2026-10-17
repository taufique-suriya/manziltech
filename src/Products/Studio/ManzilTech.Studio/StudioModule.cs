using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ManzilTech.Studio;

public static class StudioModule
{
    public static IServiceCollection AddStudioModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<StudioDbContext>(options => options.UseSqlServer(
            configuration.GetConnectionString("ManzilTech"),
            sql => sql.MigrationsHistoryTable("__EFMigrationsHistory", StudioDbContext.Schema)));

        return services;
    }
}
