terraform {
  required_version = ">= 1.6.0"

  required_providers {
    render = {
      source  = "render-oss/render"
      version = "~> 1.8"
    }
  }

  cloud {
    # Organization configured via TF_CLOUD_ORGANIZATION environment variable
    # Workspace name is static; set in CI/CD
    workspaces {
      name = "dev-connector-prod"
    }
  }
}
