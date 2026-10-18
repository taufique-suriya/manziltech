variable "subscription_id" {
  type        = string
  description = "Azure subscription ID. Set it in a git-ignored terraform.tfvars or with TF_VAR_subscription_id."
}

variable "location" {
  type        = string
  default     = "centralindia"
  description = "Region of the resource group."
}

variable "site_location" {
  type        = string
  default     = "eastasia"
  description = "Region of the Static Web Apps (same as staging; content is served worldwide)."
}

variable "custom_domains" {
  type = map(list(object({
    domain_name     = string
    validation_type = optional(string, "cname-delegation")
  })))
  default     = {}
  description = "Custom domains per app ('hub', 'hajjandumrah', 'bookings', 'studio'). Added after the DNS records exist."
}
