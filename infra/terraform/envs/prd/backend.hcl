# State storage created once by hand (see infra/README.md). Names only, no secrets.
resource_group_name  = "rg-manziltech-tfstate"
storage_account_name = "stmanziltechtfstate"
container_name       = "tfstate"
key                  = "prd.tfstate"
use_azuread_auth     = true
