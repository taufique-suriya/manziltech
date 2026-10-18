variable "name" {
  type        = string
  description = "Static Web App name, for example 'swa-manziltech-hub-prd'."
}

variable "resource_group_name" {
  type        = string
  description = "Resource group that holds the site."
}

variable "location" {
  type        = string
  description = "Azure region. Static Web Apps are offered in a few regions only."
}

variable "custom_domains" {
  type = list(object({
    domain_name     = string
    validation_type = optional(string, "cname-delegation")
  }))
  default     = []
  description = "Custom domains. Use 'dns-txt-token' as validation_type for a root (apex) domain."
}

variable "tags" {
  type    = map(string)
  default = {}
}
