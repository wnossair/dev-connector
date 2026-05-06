terraform {
  required_version = ">= 1.6.0"

  required_providers {
    render = {
      source  = "render-oss/render"
      version = "~> 1.8"
    }
  }

  cloud {
    organization = var.tf_organization

    workspaces {
      name = var.tf_workspace
    }
  }
}
