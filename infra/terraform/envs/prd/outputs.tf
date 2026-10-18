output "default_host_names" {
  value       = { for app, site in module.site : app => site.default_host_name }
  description = "CNAME targets for the custom domains at the DNS host."
}

output "deployment_tokens" {
  value       = { for app, site in module.site : app => site.deployment_token }
  sensitive   = true
  description = "Per app. Copy into the GitHub 'prd' environment as AZURE_SWA_TOKEN_<APP>; never paste into chat or commit."
}
