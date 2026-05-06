provider "render" {
  wait_for_deploy_completion = true
}

locals {
  backend_env_vars = merge(
    {
      NODE_ENV = {
        value = "production"
      }
      MONGO_URI = {
        value = var.mongo_uri
      }
      JWT_SECRET = {
        value = var.jwt_secret
      }
    },
    var.github_token == "" ? {} : {
      GITHUB_TOKEN = {
        value = var.github_token
      }
    },
    var.cors_allowed_origins_csv == "" ? {} : {
      CORS_ORIGIN = {
        value = var.cors_allowed_origins_csv
      }
    }
  )
}

resource "render_web_service" "backend" {
  name              = var.backend_service_name
  plan              = var.backend_plan
  region            = var.backend_region
  root_directory    = "server"
  start_command     = "npm start"
  health_check_path = "/"

  runtime_source = {
    native_runtime = {
      repo_url            = var.repo_url
      branch              = var.branch
      runtime             = "node"
      build_command       = "npm install && npm run build"
      auto_deploy_trigger = var.backend_auto_deploy_trigger
      build_filter = {
        paths = ["server/**"]
      }
    }
  }

  env_vars = local.backend_env_vars
}

resource "render_static_site" "frontend" {
  name                = var.frontend_service_name
  repo_url            = var.repo_url
  branch              = var.branch
  root_directory      = "client"
  build_command       = "npm install && npm run build"
  publish_path        = "dist"
  auto_deploy_trigger = var.frontend_auto_deploy_trigger

  build_filter = {
    paths = ["client/**"]
  }

  env_vars = {
    VITE_API_BASE_URL = {
      value = "${render_web_service.backend.url}/api"
    }
  }

  routes = [
    {
      type        = "rewrite"
      source      = "/*"
      destination = "/index.html"
    }
  ]
}
