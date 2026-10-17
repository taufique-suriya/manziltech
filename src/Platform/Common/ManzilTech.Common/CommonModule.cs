using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ManzilTech.Common;

public static class CommonModule
{
    public static IServiceCollection AddCommonModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<CommonDbContext>(options => options.UseSqlServer(
            configuration.GetConnectionString("ManzilTech"),
            sql => sql.MigrationsHistoryTable("__EFMigrationsHistory", CommonDbContext.Schema)));

        return services;
    }
}
