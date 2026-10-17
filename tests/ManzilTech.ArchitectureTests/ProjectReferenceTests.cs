namespace ManzilTech.ArchitectureTests;

// Boundary rules checked on the .csproj files under src/.
public sealed class ProjectReferenceTests
{
    [Fact]
    public void Every_src_project_is_in_a_known_place()
    {
        AssertNone(RepoProjects.All
            .Where(p => p.Kind == ProjectKind.Unknown)
            .Select(p => $"{p.RelativePath} is not the host, SharedKernel or a module project in src/{{Platform|Products}}/<Module>/ManzilTech.<Module>[.Contracts]/"));
    }

    [Fact]
    public void Every_reference_points_to_a_src_project()
    {
        AssertNone(References()
            .Where(r => r.To is null)
            .Select(r => $"{r.From} references {r.ToName}, which is not a project under src/"));
    }

    [Fact]
    public void SharedKernel_references_nothing()
    {
        AssertNone(RepoProjects.All
            .Where(p => p.Kind == ProjectKind.SharedKernel)
            .SelectMany(p => p.ProjectReferences.Concat(p.PackageReferences).Concat(p.FrameworkReferences)
                .Select(r => $"{p} references {r}; SharedKernel must reference nothing")));
    }

    [Fact]
    public void Contracts_reference_only_SharedKernel()
    {
        AssertNone(RepoProjects.All
            .Where(p => p.Kind == ProjectKind.Contracts)
            .SelectMany(p => p.ProjectReferences.Where(r => r != "ManzilTech.SharedKernel")
                .Concat(p.PackageReferences)
                .Concat(p.FrameworkReferences)
                .Select(r => $"{p} references {r}; Contracts may reference only ManzilTech.SharedKernel")));
    }

    [Fact]
    public void Only_the_host_references_module_implementations()
    {
        AssertNone(References()
            .Where(r => r.From.Kind != ProjectKind.Host && r.To?.Kind == ProjectKind.Implementation)
            .Select(r => $"{r.From} references {r.To}; reference {r.To}.Contracts instead"));
    }

    [Fact]
    public void Platform_never_references_products()
    {
        AssertNone(References()
            .Where(r => r.From.IsPlatform && r.To is { IsProduct: true })
            .Select(r => $"{r.From} references {r.To}; platform modules must not depend on products"));
    }

    [Fact]
    public void Nothing_references_the_host()
    {
        AssertNone(References()
            .Where(r => r.To?.Kind == ProjectKind.Host)
            .Select(r => $"{r.From} references {r.To}"));
    }

    private static IEnumerable<(SrcProject From, string ToName, SrcProject? To)> References() =>
        RepoProjects.All.SelectMany(p => p.ProjectReferences.Select(r => (p, r, RepoProjects.Find(r))));

    private static void AssertNone(IEnumerable<string> violations)
    {
        var list = violations.ToList();
        Assert.True(list.Count == 0, "Boundary violations:" + Environment.NewLine + string.Join(Environment.NewLine, list));
    }
}
