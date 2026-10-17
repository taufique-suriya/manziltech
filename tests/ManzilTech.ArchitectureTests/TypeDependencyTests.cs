using Assembly = System.Reflection.Assembly;
using ArchUnitNET.Domain;
using ArchUnitNET.Loader;
using ArchUnitNET.xUnitV3;
using Microsoft.EntityFrameworkCore;
using static ArchUnitNET.Fluent.ArchRuleDefinition;

namespace ManzilTech.ArchitectureTests;

// Boundary rules checked on the compiled types of every src project except the host.
public sealed class TypeDependencyTests
{
    private static readonly IReadOnlyList<SrcProject> Projects = RepoProjects.All
        .Where(p => p.Kind is ProjectKind.SharedKernel or ProjectKind.Contracts or ProjectKind.Implementation)
        .ToList();

    private static readonly Dictionary<string, Assembly> Assemblies = Projects
        .ToDictionary(p => p.Name, p => Assembly.Load(p.Name));

    private static readonly Architecture Architecture = new ArchLoader()
        .LoadAssemblies([.. Assemblies.Values])
        .Build();

    [Fact]
    public void Module_implementations_do_not_use_other_module_implementations()
    {
        var implementations = Projects.Where(p => p.Kind == ProjectKind.Implementation).ToList();
        foreach (var from in implementations)
        {
            foreach (var to in implementations.Where(p => p != from))
            {
                Types().That().ResideInAssembly(Assemblies[from.Name])
                    .Should().NotDependOnAny(Types().That().ResideInAssembly(Assemblies[to.Name]))
                    .Because($"{from} may use {to}.Contracts only")
                    .WithoutRequiringPositiveResults()
                    .Check(Architecture);
            }
        }
    }

    [Fact]
    public void Platform_does_not_use_products()
    {
        var platform = Projects.Where(p => p.IsPlatform).Select(p => Assemblies[p.Name]).ToArray();
        var products = Projects.Where(p => p.IsProduct).Select(p => Assemblies[p.Name]).ToArray();

        Types().That().ResideInAssembly(platform[0], platform[1..])
            .Should().NotDependOnAny(Types().That().ResideInAssembly(products[0], products[1..]))
            .Because("platform modules never depend on products")
            .WithoutRequiringPositiveResults()
            .Check(Architecture);
    }

    [Fact]
    public void Contracts_use_no_other_ManzilTech_types_except_SharedKernel()
    {
        foreach (var contracts in Projects.Where(p => p.Kind == ProjectKind.Contracts))
        {
            var others = Projects.Where(p => p != contracts && p.Kind != ProjectKind.SharedKernel).Select(p => Assemblies[p.Name]).ToArray();
            Types().That().ResideInAssembly(Assemblies[contracts.Name])
                .Should().NotDependOnAny(Types().That().ResideInAssembly(others[0], others[1..]))
                .Because($"{contracts} may depend only on ManzilTech.SharedKernel")
                .WithoutRequiringPositiveResults()
                .Check(Architecture);
        }
    }

    [Fact]
    public void SharedKernel_uses_no_module_types()
    {
        var modules = Projects.Where(p => p.Kind != ProjectKind.SharedKernel).Select(p => Assemblies[p.Name]).ToArray();

        Types().That().ResideInAssembly(Assemblies["ManzilTech.SharedKernel"])
            .Should().NotDependOnAny(Types().That().ResideInAssembly(modules[0], modules[1..]))
            .Because("SharedKernel holds technical base types only")
            .WithoutRequiringPositiveResults()
            .Check(Architecture);
    }

    [Fact]
    public void Each_module_has_exactly_one_DbContext_and_it_is_not_public()
    {
        var violations = new List<string>();
        foreach (var module in Projects.Where(p => p.Kind == ProjectKind.Implementation))
        {
            var contexts = Assemblies[module.Name].GetTypes()
                .Where(t => !t.IsAbstract && typeof(DbContext).IsAssignableFrom(t))
                .ToList();

            if (contexts.Count != 1)
            {
                violations.Add($"{module} has {contexts.Count} DbContext types; expected exactly one");
            }

            violations.AddRange(contexts.Where(t => t.IsPublic).Select(t => $"{t.FullName} is public; make it internal so other modules cannot reach its tables"));
        }

        Assert.True(violations.Count == 0, string.Join(Environment.NewLine, violations));
    }

    [Fact]
    public void No_DbContext_outside_module_implementations()
    {
        var offenders = Projects.Where(p => p.Kind != ProjectKind.Implementation)
            .SelectMany(p => Assemblies[p.Name].GetTypes())
            .Where(t => typeof(DbContext).IsAssignableFrom(t))
            .Select(t => t.FullName)
            .ToList();

        Assert.True(offenders.Count == 0, "DbContext types outside module implementations: " + string.Join(", ", offenders));
    }
}
