terraform {
  required_version = ">= 1.16.0, < 2.0.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.81.0"
    }
  }

  # Names of the state storage come from backend.hcl: 'terraform init "-backend-config=backend.hcl"' (quoted for PowerShell).
  backend "azurerm" {}
}

provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
  use_cli         = true

  # Only Microsoft.Web (Static Web Apps) and Microsoft.Resources are needed, and both are
  # registered already. Without this, Terraform tries to register a dozen unrelated providers.
  resource_provider_registrations = "none"
}
