terraform {
  required_version = ">= 1.6.0"

  required_providers {
    render = {
      source  = "render-oss/render"
      version = "~> 1.8"
    }
  }

  cloud {}
  # Organization and workspace configured via -backend-config flags in CI/CD
}
