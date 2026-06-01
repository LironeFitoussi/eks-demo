# GitHub Actions CI/CD Workflows

## Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ACCOUNT_ID` | Your AWS account ID (used to construct the ECR registry URL) |
| `AWS_DEPLOY_ROLE_ARN` | ARN of the IAM role GitHub Actions assumes via OIDC (from Terraform output `github_deploy_role_arn`) |
| `EKS_CLUSTER_NAME` | Name of the EKS cluster (from Terraform output `cluster_name`) |

## How OIDC Works

These workflows use OpenID Connect (OIDC) to authenticate with AWS — no long-lived access keys are stored as secrets.

1. GitHub generates a short-lived OIDC token for each workflow run.
2. The `aws-actions/configure-aws-credentials` action exchanges that token for temporary AWS credentials by assuming the IAM role specified in `AWS_DEPLOY_ROLE_ARN`.
3. The IAM role's trust policy restricts which GitHub repositories and branches can assume it.
4. Temporary credentials expire automatically after the job completes.

This approach eliminates the risk of leaked static credentials and follows AWS security best practices.

## Workflows

### `ci.yml` — PR Checks

**Triggers:** Pull requests targeting `main`

Runs two parallel jobs on every PR:
- **backend-lint-test**: Installs Node 20 dependencies, runs ESLint, and runs the test suite.
- **frontend-lint-build**: Installs Node 20 dependencies, runs lint (non-blocking), and produces a production build.

No AWS access is required for CI checks.

### `deploy.yml` — Build, Push, Deploy

**Triggers:** Pushes to `main` (merges from PRs)

Two sequential jobs:
1. **build-and-push**: Authenticates to ECR via OIDC, builds Docker images for both `helpdesk-frontend` and `helpdesk-api`, and pushes them tagged with the Git SHA and `latest`.
2. **deploy**: Updates the EKS kubeconfig, substitutes the versioned image tags into the Kubernetes manifests, applies all manifests in the `helpdesk-prod` namespace, and waits for both deployments to roll out successfully.

### `terraform-plan.yml` — Terraform Plan on PR

**Triggers:** Pull requests targeting `main` that include changes under `infra/terraform/`

Steps:
1. Sets up Terraform 1.6.0.
2. Authenticates to AWS via OIDC.
3. Runs `terraform init`, `terraform validate`, and `terraform plan`.
4. Posts the full plan output as a comment on the PR for review.

Terraform changes are never applied automatically — applies must be done manually or via a separate promotion workflow.
