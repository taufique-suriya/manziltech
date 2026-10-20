# ManzilTech: guide for contributors and AI agents

## Layout (target; built up stage by stage)

```
ManzilTech.slnx              .NET solution (root)
apps/       hub, hajjandumrah, bookings, studio     Next.js + TypeScript, one app per subdomain
packages/   config, design-tokens, ui, validation, api-client   shared frontend code
src/
  ManzilTech.Host/           the single ASP.NET Core host (modular monolith, .NET 10)
  ManzilTech.SharedKernel/   technical base types only, no business data
  Platform/                  Common, Payments
  Products/                  HajjAndUmrah, Bookings, Studio
tests/      ManzilTech.ArchitectureTests + one test project per module
infra/      Terraform for Azure (production; staging later), see infra/README.md
docs/       functional docs (setup, architecture, database)
```

Each module is two projects: `ManzilTech.<Name>` (implementation) and `ManzilTech.<Name>.Contracts` (its public surface).

## Boundary rules

Rule 1 is enforced by ESLint; rules 2–6 by `tests/ManzilTech.ArchitectureTests` (project files and compiled types).

1. Frontend apps never import from each other, only from `packages/`. Inside an app, import with `@/`, not `../`.
2. Only `ManzilTech.Host` (the composition root) references module implementations. Every other project may reference only a module's `.Contracts`.
3. Platform modules may use other platform modules' Contracts and never reference products. Products may use any module's Contracts.
4. Contracts reference only SharedKernel (no other projects, no packages). SharedKernel references nothing.
5. Every module has exactly one `internal` DbContext on its own lowercase schema, with the migration history table in that schema. No module reads another module's tables.
6. Nothing references the host, and every project under `src/` sits in a known place (`ManzilTech.Host`, `ManzilTech.SharedKernel`, or `{Platform|Products}/<Module>/ManzilTech.<Module>[.Contracts]`).

Payments owns money only. Each product owns its own booking or order data.
Prefer events and coarse-grained calls between modules. No transaction spans two modules.

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
