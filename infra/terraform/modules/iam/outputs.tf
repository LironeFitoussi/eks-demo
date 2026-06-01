output "github_deploy_role_arn" {
  description = "ARN of the GitHub Actions deploy IAM role"
  value       = aws_iam_role.github_deploy.arn
}

output "alb_controller_role_arn" {
  description = "ARN of the AWS Load Balancer Controller IRSA role"
  value       = aws_iam_role.alb_controller.arn
}

output "github_actions_oidc_provider_arn" {
  description = "ARN of the GitHub Actions OIDC provider"
  value       = aws_iam_openid_connect_provider.github_actions.arn
}
