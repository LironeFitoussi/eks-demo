variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "helpdesk-prod"
}

variable "environment" {
  description = "Environment name (prod, staging, dev)"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Optional: domain name for Route53/ACM (leave empty to skip)"
  type        = string
  default     = ""
}

variable "github_repo" {
  description = "GitHub repository in owner/repo format, e.g. LironeFitoussi/eks-demo"
  type        = string
  default     = "LironeFitoussi/eks-demo"
}

variable "node_instance_type" {
  description = "EC2 instance type for EKS managed node group"
  type        = string
  default     = "t3.medium"
}

variable "node_desired" {
  description = "Desired number of EKS worker nodes"
  type        = number
  default     = 2
}

variable "node_min" {
  description = "Minimum number of EKS worker nodes"
  type        = number
  default     = 2
}

variable "node_max" {
  description = "Maximum number of EKS worker nodes"
  type        = number
  default     = 6
}
