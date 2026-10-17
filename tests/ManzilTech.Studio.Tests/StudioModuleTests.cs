using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ManzilTech.Studio.Tests;

public sealed class StudioModuleTests
{
    [Fact]
    public void DbContext_uses_its_own_schema_for_tables_and_migration_history()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { ["ConnectionStrings:ManzilTech"] = "Server=unused;Database=unused" })
            .Build();
        using var provider = new ServiceCollection().AddStudioModule(configuration).BuildServiceProvider();
        using var scope = provider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<StudioDbContext>();

        Assert.Equal("studio", context.GetService<IDesignTimeModel>().Model.GetDefaultSchema());
        Assert.Contains("[studio].[__EFMigrationsHistory]", context.GetService<IHistoryRepository>().GetCreateScript(), StringComparison.Ordinal);
    }
}
