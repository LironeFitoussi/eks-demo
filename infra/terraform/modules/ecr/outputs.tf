output "frontend_repository_url" {
  description = "ECR repository URL for helpdesk-frontend"
  value       = aws_ecr_repository.frontend.repository_url
}

output "api_repository_url" {
  description = "ECR repository URL for helpdesk-api"
  value       = aws_ecr_repository.api.repository_url
}

output "frontend_repository_arn" {
  description = "ECR repository ARN for helpdesk-frontend"
  value       = aws_ecr_repository.frontend.arn
}

output "api_repository_arn" {
  description = "ECR repository ARN for helpdesk-api"
  value       = aws_ecr_repository.api.arn
}
