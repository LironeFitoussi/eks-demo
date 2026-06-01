variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository in owner/repo format"
  type        = string
}

variable "s3_bucket_arn" {
  description = "ARN of the S3 attachments bucket"
  type        = string
}

variable "eks_oidc_provider_arn" {
  description = "ARN of the EKS OIDC provider"
  type        = string
}

variable "eks_oidc_provider_url" {
  description = "URL of the EKS OIDC provider (without https://)"
  type        = string
}

variable "ecr_frontend_arn" {
  description = "ARN of the ECR frontend repository"
  type        = string
}

variable "ecr_api_arn" {
  description = "ARN of the ECR API repository"
  type        = string
}
