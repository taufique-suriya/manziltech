# Database

One SQL Server database (`ManzilTech`), one schema per module:

| Module | DbContext | Schema |
|---|---|---|
| Common | `CommonDbContext` | `common` |
| Payments | `PaymentsDbContext` | `payments` |
| HajjAndUmrah | `HajjAndUmrahDbContext` | `hajjandumrah` |
| Bookings | `BookingsDbContext` | `bookings` |
| Studio | `StudioDbContext` | `studio` |

Each DbContext keeps its migrations history table in its own schema (`<schema>.__EFMigrationsHistory`), so modules never share migration history. A module never reads another module's tables.

The connection string is `ConnectionStrings:ManzilTech`, set locally with user-secrets (see [setup.md](setup.md)).

## Migrations

There are no migrations yet. Commands, using Payments as the example (run from the repo root):

```bash
# Add a migration to the module's own project
dotnet ef migrations add <Name> --project src/Platform/Payments/ManzilTech.Payments --startup-project src/ManzilTech.Host --context PaymentsDbContext --output-dir Migrations

# Apply it to your local database
dotnet ef database update --project src/Platform/Payments/ManzilTech.Payments --startup-project src/ManzilTech.Host --context PaymentsDbContext

# List migrations and whether they are applied
dotnet ef migrations list --project src/Platform/Payments/ManzilTech.Payments --startup-project src/ManzilTech.Host --context PaymentsDbContext
```

`dotnet-ef` is a local tool pinned in `.config/dotnet-tools.json`; run `dotnet tool restore` once.
