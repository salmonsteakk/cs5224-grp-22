## LearnBright — Terraform (AWS infra summary)

This folder contains the Terraform configuration that provisions the AWS infrastructure for LearnBright. The purpose of this README is to describe the AWS resources created by each file and how they connect to form the deployment architecture.

Architecture overview (high level)
- CloudFront is the public entry point. It serves the React SPA from an S3 origin and proxies API and health routes to an Application Load Balancer (ALB).
- The ALB routes requests to an ECS Fargate service running the Express API. The API container image is stored in ECR.
- The application data is stored in DynamoDB. Terraform provisions the `Subjects` table; the `Users` table is created by the backend seed logic at runtime.

Terraform files (what each one provisions)
- `main.tf` — Terraform Cloud backend configuration and AWS provider settings. Adds default tags to resources.
- `variables.tf` — Input variables used across the configuration (region, app name, server port, CPU/memory).
- `outputs.tf` — Useful outputs after apply (CloudFront URL, ALB DNS, ECR repo URL, S3 bucket name, distribution id, ECS names, DynamoDB table name).

- `network.tf` — VPC, Internet Gateway, two public subnets (one per AZ), public route table, route table associations, a DynamoDB VPC Gateway Endpoint, and security groups for ALB and ECS tasks.

- `alb.tf` — Application Load Balancer, target group, and listener. Health check configured against `/health`.

- `ecs.tf` — ECS cluster, Fargate task definition (uses the ECR image), CloudWatch log group, and ECS service configured to register with the ALB target group.

- `ecr.tf` — ECR repository for the API container image and a lifecycle policy to retain recent images.

- `dynamodb.tf` — DynamoDB `Subjects` table with `id` as the partition key and on-demand billing.

- `s3.tf` — S3 bucket for frontend static files with a policy that allows CloudFront to access objects.

- `cloudfront.tf` — CloudFront distribution with two origins (S3 for static assets and ALB for API). Default behavior serves the SPA; `/api/*` and `/health` are forwarded to ALB with caching disabled for API paths.

- `iam.tf` — IAM roles and policies: ECS execution role (managed policy) and ECS task role with permissions for DynamoDB table access.

How resources connect (data & request flows)
1. Users hit CloudFront (HTTPS). Static assets are served from S3. Requests matching `/api/*` or `/health` are forwarded to the ALB origin.
2. ALB forwards traffic to ECS Fargate tasks (registered by IP). ECS tasks run the Express API container.
3. The API accesses DynamoDB for Subjects data. Network path uses the VPC's DynamoDB gateway endpoint so traffic stays on AWS network.

Key notes relevant to AWS structure
- Terraform Cloud backend: the repo config is set to use Terraform Cloud (`learnbright` organization, `learnbright-aws` workspace). If you don't use Terraform Cloud, remove or modify the `terraform { cloud { ... } }` block before running locally.
- `Users` table is not managed by Terraform; it is created by backend seed logic at runtime. If you prefer full IaC, add a second `aws_dynamodb_table` resource for `Users`.
- ECS tasks are deployed into public subnets with `assign_public_ip = true`. For a more private deployment, move tasks to private subnets and use NAT gateways for egress.
- CloudFront uses the default certificate. To serve a custom domain, provision an ACM certificate in `us-east-1` and update the CloudFront `viewer_certificate` block.

This README focuses only on the AWS infrastructure created by Terraform. For runtime behaviours (DB seeding, demo user creation, application code), see the backend source code.