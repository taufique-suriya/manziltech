locals {
  apps = toset(["hub", "hajjandumrah", "bookings", "studio"])
  tags = {
    project     = "manziltech"
    environment = "prd"
  }
}

resource "azurerm_resource_group" "prd" {
  name     = "rg-manziltech-prd"
  location = var.location
  tags     = local.tags
}

module "site" {
  source   = "../../modules/static-site"
  for_each = local.apps

  name                = "swa-manziltech-${each.key}-prd"
  resource_group_name = azurerm_resource_group.prd.name
  location            = var.site_location
  custom_domains      = lookup(var.custom_domains, each.key, [])
  tags                = local.tags
}
