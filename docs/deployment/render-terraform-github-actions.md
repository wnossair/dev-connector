# Render + Terraform + GitHub Actions Deployment Guide

This project now includes infrastructure code under `infra/terraform` and workflows under `.github/workflows`.

Use this runbook for the account-level steps that must be done manually.

## What is already implemented in code

- Render infrastructure defined with Terraform:
  - `render_web_service` for backend (`server/`)
  - `render_static_site` for frontend (`client/`)
- Frontend API base URL is environment-driven via `VITE_API_BASE_URL`
- Backend supports optional CORS origins via `CORS_ORIGIN`
- GitHub Actions workflows:
  - `CI` for lint/type-check/build
  - `Terraform Render` for plan on PR and apply on `main`

## Manual setup checklist (required)

### 1) Render account and workspace

1. Sign in to Render.
2. Select the workspace you want to use (`dev-connector`).
3. Open workspace settings and copy the Owner ID (starts with `usr-` or `tea-`).
4. Open user settings and generate a Render API key.
5. Store both values securely for GitHub secrets.

Notes:

- If you started creating a manual web service, stop and leave it unprovisioned.
- Terraform will create and manage services from code.

### 2) Terraform Cloud workspace variables

The workflow uses Terraform Cloud remote state via `backend "remote" {}`.

1. In Terraform Cloud, open your organization and workspace.
2. Confirm VCS is connected to this repository.
3. Create an API token in Terraform Cloud (user settings).
4. Keep these values ready for GitHub secrets:
   - Terraform organization name
   - Terraform workspace name
   - Terraform API token

### 3) MongoDB production access

1. Confirm your production MongoDB Atlas cluster is running.
2. Confirm DB user credentials are valid.
3. Confirm Atlas network access allows your Render service to connect.
4. Copy the production Mongo connection string.

### 4) GitHub repository secrets

Go to repository Settings -> Secrets and variables -> Actions.

Create these repository secrets exactly:

- `RENDER_API_KEY`
- `RENDER_OWNER_ID`
- `TF_API_TOKEN`
- `TF_ORGANIZATION`
- `TF_WORKSPACE`
- `MONGO_URI`
- `JWT_SECRET`
- `GITHUB_TOKEN_RENDER` (optional)
- `CORS_ALLOWED_ORIGINS_CSV` (optional, comma-separated)

Recommended value for `CORS_ALLOWED_ORIGINS_CSV` initially:

- leave empty for first bootstrap, then set to frontend domain after first apply
- example: `https://dev-connector-web.onrender.com`

### 5) GitHub environment protection (recommended)

1. Create a GitHub environment named `production`.
2. Add required reviewers for protected apply if you want manual approval gates.
3. Keep the workflow job mapped to that environment.

### 6) Branch protection (recommended)

Protect `main` branch and require the `CI` workflow to pass before merge.
This is required for safe `checksPass` auto-deploy behavior in Render.

## First deployment sequence

1. Push Terraform and workflow files to a feature branch.
2. Open a PR.
3. Verify `CI` and `Terraform Render / plan` pass.
4. Merge PR to `main`.
5. Verify `Terraform Render / apply` succeeds.
6. In Terraform outputs, capture:
   - `backend_service_url`
   - `frontend_service_url`
7. Set `CORS_ALLOWED_ORIGINS_CSV` secret to the frontend URL (or custom domain) and re-run apply.
8. Verify login/profile/posts flows in production.

## Optional custom domains

After first deploy:

1. Add custom domain(s) in Render service settings.
2. Add DNS records in your DNS provider exactly as Render instructs.
3. Update `CORS_ALLOWED_ORIGINS_CSV` to include final frontend domain(s).
4. Re-run Terraform apply if needed.

## If you already created a manual service in Render

Choose one path:

- Preferred: delete the manual draft service and let Terraform create managed services.
- Advanced: import existing service(s) into Terraform state using `terraform import`.

For most cases, deletion + Terraform recreate is simpler and less error-prone.

## Troubleshooting quick checks

- Terraform init fails: verify `TF_API_TOKEN`, `TF_ORGANIZATION`, `TF_WORKSPACE`
- Render provider auth fails: verify `RENDER_API_KEY`, `RENDER_OWNER_ID`
- Backend boot fails: verify `MONGO_URI`, `JWT_SECRET`
- Frontend calls wrong API: verify `VITE_API_BASE_URL` in Terraform static site env vars
- CORS blocked in browser: set `CORS_ALLOWED_ORIGINS_CSV` to exact frontend origin(s)
