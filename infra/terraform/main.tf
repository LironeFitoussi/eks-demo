module "vpc" {
  source = "./modules/vpc"

  cluster_name = var.cluster_name
  environment  = var.environment
}

module "eks" {
  source = "./modules/eks"

  cluster_name       = var.cluster_name
  environment        = var.environment
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  node_instance_type = var.node_instance_type
  node_desired       = var.node_desired
  node_min           = var.node_min
  node_max           = var.node_max
}

module "ecr" {
  source = "./modules/ecr"

  environment = var.environment
}

module "s3" {
  source = "./modules/s3"

  environment = var.environment
}

module "iam" {
  source = "./modules/iam"

  cluster_name          = var.cluster_name
  environment           = var.environment
  github_repo           = var.github_repo
  s3_bucket_arn         = module.s3.bucket_arn
  eks_oidc_provider_arn = module.eks.oidc_provider_arn
  eks_oidc_provider_url = module.eks.oidc_provider_url
  ecr_frontend_arn      = module.ecr.frontend_repository_arn
  ecr_api_arn           = module.ecr.api_repository_arn
}
