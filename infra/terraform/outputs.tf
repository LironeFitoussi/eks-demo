output "cluster_name" {
  description = "EKS cluster name"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS cluster API endpoint"
  value       = module.eks.cluster_endpoint
}

output "cluster_ca" {
  description = "EKS cluster CA certificate (base64)"
  value       = module.eks.cluster_ca
  sensitive   = true
}

output "ecr_frontend_url" {
  description = "ECR repository URL for helpdesk-frontend"
  value       = module.ecr.frontend_repository_url
}

output "ecr_api_url" {
  description = "ECR repository URL for helpdesk-api"
  value       = module.ecr.api_repository_url
}

output "s3_bucket_name" {
  description = "Name of the S3 attachments bucket"
  value       = module.s3.bucket_name
}

output "github_deploy_role_arn" {
  description = "ARN of the IAM role for GitHub Actions deployments"
  value       = module.iam.github_deploy_role_arn
}

output "alb_controller_role_arn" {
  description = "ARN of the IRSA role for the AWS Load Balancer Controller"
  value       = module.iam.alb_controller_role_arn
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}
