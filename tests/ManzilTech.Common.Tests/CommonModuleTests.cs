using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ManzilTech.Common.Tests;

public sealed class CommonModuleTests
{
    [Fact]
    public void DbContext_uses_its_own_schema_for_tables_and_migration_history()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { ["ConnectionStrings:ManzilTech"] = "Server=unused;Database=unused" })
            .Build();
        using var provider = new ServiceCollection().AddCommonModule(configuration).BuildServiceProvider();
        using var scope = provider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CommonDbContext>();

        Assert.Equal("common", context.GetService<IDesignTimeModel>().Model.GetDefaultSchema());
        Assert.Contains("[common].[__EFMigrationsHistory]", context.GetService<IHistoryRepository>().GetCreateScript(), StringComparison.Ordinal);
    }
}
