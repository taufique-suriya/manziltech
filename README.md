# ManzilTech

Monorepo for the ManzilTech web apps and backend:

- **Frontends**: Next.js + TypeScript, one app per subdomain (`apps/`), sharing code from `packages/`.
- **Backend**: .NET 10, a single ASP.NET Core host (modular monolith) with one module per product plus platform modules (`src/`).
- **Data**: EF Core on SQL Server, one schema per module.

## Layout

```
apps/       hub, hajjandumrah, bookings, studio      Next.js apps
packages/   config, design-tokens, ui, api-client    shared frontend code
src/        ManzilTech.Host, SharedKernel, Platform/*, Products/*
tests/      architecture tests + one test project per module
docs/       setup, architecture, database
```

## Quick start

Prerequisites and one-time setup: [docs/setup.md](docs/setup.md).

```bash
pnpm install
dotnet tool restore
pnpm build                                   # all apps and the backend, via Turborepo
pnpm test                                    # all .NET tests
pnpm --filter @manziltech/hub dev            # http://localhost:3000
dotnet run --project src/ManzilTech.Host     # http://localhost:5180/health
```

## More

- [docs/architecture.md](docs/architecture.md): how the modules fit together and how to add one
- [docs/database.md](docs/database.md): schemas and migrations
- [AGENTS.md](AGENTS.md): naming and boundary rules (for people and AI tools)

Proprietary. See [LICENSE](LICENSE).
