variable "repo_url" {
  description = "Git repository URL used by Render services"
  type        = string
  default     = "https://github.com/wnossair/dev-connector"
}

variable "branch" {
  description = "Git branch Render builds from"
  type        = string
  default     = "main"
}

variable "backend_service_name" {
  description = "Render backend web service name"
  type        = string
  default     = "dev-connector-api"
}

variable "frontend_service_name" {
  description = "Render frontend static site name"
  type        = string
  default     = "dev-connector-web"
}

variable "backend_region" {
  description = "Render region for the backend web service"
  type        = string
  default     = "oregon"
}

variable "backend_plan" {
  description = "Render plan for backend web service"
  type        = string
  default     = "starter"
}

variable "frontend_auto_deploy_trigger" {
  description = "Auto deploy mode for frontend service"
  type        = string
  default     = "checksPass"
}

variable "backend_auto_deploy_trigger" {
  description = "Auto deploy mode for backend service"
  type        = string
  default     = "checksPass"
}

variable "mongo_uri" {
  description = "MongoDB connection string for production"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT signing secret for production"
  type        = string
  sensitive   = true
}

variable "github_token" {
  description = "Optional GitHub API token for profile repo lookup"
  type        = string
  sensitive   = true
  default     = ""
}

variable "cors_allowed_origins_csv" {
  description = "Optional comma-separated CORS origins for backend"
  type        = string
  default     = ""
}

# Note: Terraform Cloud organization is provided via TF_CLOUD_ORGANIZATION in CI/CD.
# Workspace is selected by the static cloud.workspaces.name value in
# infra/terraform/versions.tf (currently dev-connector-prod).
# These are not Terraform input variables.
