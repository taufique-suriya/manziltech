# Local setup

## Prerequisites

| Tool | Version | Notes |
|---|---|---|
| .NET SDK | 10.0.402 or a newer 10.0 feature band | Pinned in `global.json` |
| Node.js | 24 (LTS) | Pinned in `.nvmrc` |
| pnpm | 12.14.0 | Pinned in `package.json` (`packageManager`) |
| SQL Server | 2025 Developer (free) or Express | Default instance on `localhost`, Windows authentication |
| Git | recent | |

Visual Studio 2026 opens `ManzilTech.slnx` directly.

On Windows, if `dotnet` says "No .NET SDKs were found", make sure `C:\Program Files\dotnet\` comes before `C:\Program Files (x86)\dotnet\` in the system `Path`.

## One-time setup

From the repo root:

```bash
pnpm install
dotnet tool restore
dotnet user-secrets set "ConnectionStrings:ManzilTech" "Server=localhost;Database=ManzilTech;Trusted_Connection=True;TrustServerCertificate=True" --project src/ManzilTech.Host
```

The connection string lives in user-secrets on your machine, never in the repo. Only needed once migrations exist; the host starts without a database.

For the `https` launch profile, trust the development certificate once (Windows shows a prompt):

```bash
dotnet dev-certs https --trust
```

## Everyday commands

| Task | Command |
|---|---|
| Build everything | `pnpm build` |
| Lint and typecheck frontends | `pnpm lint` and `pnpm typecheck` |
| Run all .NET tests | `pnpm test` or `dotnet test --solution ManzilTech.slnx` |
| Run one app | `pnpm --filter @manziltech/<app> dev` |
| Run the backend | `dotnet run --project src/ManzilTech.Host` |

Dev ports:

| App | URL |
|---|---|
| hub | http://localhost:3000 |
| hajjandumrah | http://localhost:3001 |
| bookings | http://localhost:3002 |
| studio | http://localhost:3003 |
| Host | http://localhost:5180 (`/health`, `/openapi/v1.json`) |

Turborepo caches results, so a second `pnpm build` with no changes finishes in under a second.

## Line endings

The repo stores LF line endings (`.gitattributes`) and `.editorconfig` tells editors to use LF and UTF-8 without BOM, so line endings never show up as changes.
