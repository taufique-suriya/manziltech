# Architecture

## Shape

```
Browser ──> apps/<app> (Next.js) ──> ManzilTech.Host (ASP.NET Core) ──> SQL Server
                 │                         │                              schema per module
          packages/ui, design-tokens       ├─ Platform: Common, Payments
          packages/api-client              └─ Products: HajjAndUmrah, Bookings, Studio
```

- Each frontend is deployed on its own subdomain and talks to the backend only through `packages/api-client`, which will be generated from the host's OpenAPI document (`/openapi/v1.json`).
- The backend is one process. Modules are separate projects with enforced boundaries, so any module can later move to its own host.

## A module

```
src/Products/Bookings/
  ManzilTech.Bookings/              implementation
    BookingsDbContext.cs            internal, schema "bookings"
    BookingsModule.cs               AddBookingsModule(services, configuration)
  ManzilTech.Bookings.Contracts/    the only part other modules may reference
tests/ManzilTech.Bookings.Tests/
```

- The host calls `Add<Name>Module()` for every module in `Program.cs`. It is the only project that references implementations.
- Other modules talk to a module through its Contracts (interfaces, DTOs, events). Prefer events and coarse-grained calls; no transaction spans two modules.
- Shared technical types go in `ManzilTech.SharedKernel`, never business data.

## Boundaries and how they are enforced

The rules are listed in [AGENTS.md](../AGENTS.md). Enforcement:

| Rule | Enforced by |
|---|---|
| Apps never import from other apps | ESLint (`packages/config/eslint`) |
| Project references between modules | `tests/ManzilTech.ArchitectureTests/ProjectReferenceTests.cs` (reads the `.csproj` files) |
| Type dependencies between modules | `tests/ManzilTech.ArchitectureTests/TypeDependencyTests.cs` (ArchUnitNET) |
| One internal DbContext per module, own schema | Architecture tests + each module's test project |

A violation fails `dotnet test`, and therefore CI.

## Adding a module

1. Create `src/{Platform|Products}/<Name>/ManzilTech.<Name>/` and `ManzilTech.<Name>.Contracts/`, copying an existing module (folder = project = namespace).
2. Give its DbContext a lowercase schema and keep the class `internal`.
3. Add `InternalsVisibleTo` for `ManzilTech.<Name>.Tests` and create `tests/ManzilTech.<Name>.Tests/`.
4. Reference the implementation from `ManzilTech.Host` and call `Add<Name>Module()` in `Program.cs`.
5. Add both projects to `tests/ManzilTech.ArchitectureTests/ManzilTech.ArchitectureTests.csproj` and to `ManzilTech.slnx`.
6. Run `dotnet test --solution ManzilTech.slnx`.

## Adding a frontend app

1. Copy an existing app under `apps/<name>` (lowercase, no `-web` suffix) and set `"name": "@manziltech/<name>"` and a free dev port.
2. Add the package name to the app list in `packages/config/eslint/base.js`.
3. Run `pnpm install` and `pnpm build`.

## CI

`.github/workflows/dotnet.yml` and `frontend.yml` run on pushes and pull requests to `master`, each only when its own files change. No deployment yet.
