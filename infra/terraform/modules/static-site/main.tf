resource "azurerm_static_web_app" "this" {
  name                = var.name
  resource_group_name = var.resource_group_name
  location            = var.location
  sku_tier            = "Free"
  sku_size            = "Free"
  tags                = var.tags

  # The deploy workflow's upload records the repository and branch on the site. Terraform does not
  # manage them, so leave them alone instead of clearing them on every plan.
  lifecycle {
    ignore_changes = [repository_url, repository_branch]
  }
}

# Each custom domain is validated through DNS. 'cname-delegation' (subdomains) waits until the
# CNAME record exists at the DNS host, so domains are added only after the record is in place.
resource "azurerm_static_web_app_custom_domain" "this" {
  for_each = { for d in var.custom_domains : d.domain_name => d }

  static_web_app_id = azurerm_static_web_app.this.id
  domain_name       = each.value.domain_name
  validation_type   = each.value.validation_type
}
