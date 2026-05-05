output "backend_service_id" {
  value       = render_web_service.backend.id
  description = "Render service id for backend web service"
}

output "backend_service_url" {
  value       = render_web_service.backend.url
  description = "Public URL of backend web service"
}

output "frontend_service_id" {
  value       = render_static_site.frontend.id
  description = "Render service id for frontend static site"
}

output "frontend_service_url" {
  value       = render_static_site.frontend.url
  description = "Public URL of frontend static site"
}
