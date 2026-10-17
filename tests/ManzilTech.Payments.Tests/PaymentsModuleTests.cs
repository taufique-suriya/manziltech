using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ManzilTech.Payments.Tests;

public sealed class PaymentsModuleTests
{
    [Fact]
    public void DbContext_uses_its_own_schema_for_tables_and_migration_history()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { ["ConnectionStrings:ManzilTech"] = "Server=unused;Database=unused" })
            .Build();
        using var provider = new ServiceCollection().AddPaymentsModule(configuration).BuildServiceProvider();
        using var scope = provider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<PaymentsDbContext>();

        Assert.Equal("payments", context.GetService<IDesignTimeModel>().Model.GetDefaultSchema());
        Assert.Contains("[payments].[__EFMigrationsHistory]", context.GetService<IHistoryRepository>().GetCreateScript(), StringComparison.Ordinal);
    }
}
