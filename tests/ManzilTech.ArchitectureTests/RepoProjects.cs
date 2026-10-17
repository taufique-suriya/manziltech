using System.Xml.Linq;

namespace ManzilTech.ArchitectureTests;

internal enum ProjectKind
{
    Unknown,
    Host,
    SharedKernel,
    Contracts,
    Implementation,
}

internal sealed record SrcProject(
    string Name,
    string RelativePath,
    ProjectKind Kind,
    string? Area,
    string? Module,
    IReadOnlyList<string> ProjectReferences,
    IReadOnlyList<string> PackageReferences,
    IReadOnlyList<string> FrameworkReferences)
{
    public bool IsPlatform => Area == "Platform";

    public bool IsProduct => Area == "Products";

    public override string ToString() => Name;
}

// Reads the .csproj files under src/. Project references are checked here, not in the
// compiled assemblies, because the compiler drops references that no code uses yet.
internal static class RepoProjects
{
    public static string RepoRoot { get; } = FindRepoRoot();

    public static IReadOnlyList<SrcProject> All { get; } = Load();

    public static SrcProject? Find(string name) => All.SingleOrDefault(p => p.Name == name);

    private static string FindRepoRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir is not null && !File.Exists(Path.Combine(dir.FullName, "ManzilTech.slnx")))
        {
            dir = dir.Parent;
        }

        return dir?.FullName ?? throw new InvalidOperationException($"ManzilTech.slnx not found above {AppContext.BaseDirectory}.");
    }

    private static List<SrcProject> Load()
    {
        var src = Path.Combine(RepoRoot, "src");
        return Directory.EnumerateFiles(src, "*.csproj", SearchOption.AllDirectories)
            .Where(path => !path.Split(Path.DirectorySeparatorChar).Any(part => part is "bin" or "obj"))
            .Select(path => Parse(src, path))
            .OrderBy(p => p.Name, StringComparer.Ordinal)
            .ToList();
    }

    private static SrcProject Parse(string src, string path)
    {
        var name = Path.GetFileNameWithoutExtension(path);
        var relativePath = Path.GetRelativePath(src, path).Replace('\\', '/');
        var document = XDocument.Load(path);

        List<string> Includes(string element) => document.Descendants(element)
            .Select(e => (string?)e.Attribute("Include"))
            .OfType<string>()
            .ToList();

        var projectReferences = Includes("ProjectReference")
            .Select(include => Path.GetFileNameWithoutExtension(include.Replace('\\', '/')))
            .ToList();

        var (kind, area, module) = Classify(name, relativePath);
        return new SrcProject(name, relativePath, kind, area, module, projectReferences, Includes("PackageReference"), Includes("FrameworkReference"));
    }

    // Folder = project name, and modules sit at src/{Platform|Products}/<Module>/ManzilTech.<Module>[.Contracts]/.
    private static (ProjectKind Kind, string? Area, string? Module) Classify(string name, string relativePath)
    {
        var parts = relativePath.Split('/');

        if (parts is [var folder, _] && folder == name)
        {
            return name switch
            {
                "ManzilTech.Host" => (ProjectKind.Host, null, null),
                "ManzilTech.SharedKernel" => (ProjectKind.SharedKernel, null, null),
                _ => (ProjectKind.Unknown, null, null),
            };
        }

        if (parts is [var area and ("Platform" or "Products"), var module, var moduleFolder, _] && moduleFolder == name)
        {
            if (name == $"ManzilTech.{module}")
            {
                return (ProjectKind.Implementation, area, module);
            }

            if (name == $"ManzilTech.{module}.Contracts")
            {
                return (ProjectKind.Contracts, area, module);
            }
        }

        return (ProjectKind.Unknown, null, null);
    }
}
