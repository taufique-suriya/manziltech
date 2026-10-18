output "default_host_name" {
  value       = azurerm_static_web_app.this.default_host_name
  description = "Address on azurestaticapps.net; the target of the CNAME record for custom domains."
}

output "deployment_token" {
  value       = azurerm_static_web_app.this.api_key
  sensitive   = true
  description = "Token the deploy workflow uses to upload files. Goes into the GitHub environment as a secret."
}
