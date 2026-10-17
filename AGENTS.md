# ManzilTech: guide for contributors and AI agents

## Layout (target; built up stage by stage)

```
ManzilTech.slnx              .NET solution (root)
apps/       hub, hajjandumrah, bookings, studio     Next.js + TypeScript, one app per subdomain
packages/   config, design-tokens, ui, api-client   shared frontend code
src/
  ManzilTech.Host/           the single ASP.NET Core host (modular monolith, .NET 10)
  ManzilTech.SharedKernel/   technical base types only, no business data
  Platform/                  Common, Payments
  Products/                  HajjAndUmrah, Bookings, Studio
tests/      ManzilTech.ArchitectureTests + one test project per module
docs/       functional docs (setup, architecture, database)
```

Each module is two projects: `ManzilTech.<Name>` (implementation) and `ManzilTech.<Name>.Contracts` (its public surface).

## Boundary rules (architecture tests will enforce these)

1. Frontend apps never import from each other, only from `packages/`.
2. Other modules may reference only a module's `.Contracts` project, never its implementation.
3. Every module owns one DbContext, one schema and its migrations. The migration history table lives in that schema. No module reads another module's tables.
4. Platform modules never reference products.
5. Contracts projects do not reference each other. Shared types go in SharedKernel.
6. Payments owns money only. Each product owns its own booking or order data.

## Naming and casing

- .NET: PascalCase, prefix `ManzilTech.`, folder = project = namespace. No `Platform` or `Products` segment in namespaces.
- Database schemas: lowercase (`common`, `payments`, `hajjandumrah`, `bookings`, `studio`).
- `apps/` and `packages/` folders: lowercase, kebab-case, no `-web` suffix. npm packages: `@manziltech/<name>`.
- Branches: `type/short-name` (`chore/`, `feature/`, `fix/`).
- CI runs on Linux, which is case-sensitive: keep casing identical everywhere.

## Workflow

- Work on a branch, never directly on `master`. Small commits, one concern each.
- Never commit secrets (`.env`, connection strings, keys). Local settings go in .NET user-secrets.
- This repository is public: treat everything committed as world-readable.
