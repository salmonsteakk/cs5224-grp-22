#!/bin/bash
set -e

REGION="ap-southeast-1"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# --- Resolve config: use env vars if set, otherwise read from Terraform outputs ---
if [ -n "$ECR_REPO" ] && [ -n "$S3_BUCKET" ] && [ -n "$CF_DIST_ID" ] && [ -n "$ECS_CLUSTER" ] && [ -n "$ECS_SERVICE" ]; then
  echo "Using config from environment variables"
else
  echo "Reading config from Terraform outputs..."
  TF_DIR="$PROJECT_DIR/terraform"
  ECR_REPO=$(cd "$TF_DIR" && terraform output -raw ecr_repository_url)
  S3_BUCKET=$(cd "$TF_DIR" && terraform output -raw frontend_bucket_name)
  CF_DIST_ID=$(cd "$TF_DIR" && terraform output -raw cloudfront_distribution_id)
  ECS_CLUSTER=$(cd "$TF_DIR" && terraform output -raw ecs_cluster_name)
  ECS_SERVICE=$(cd "$TF_DIR" && terraform output -raw ecs_service_name)
fi

ECR_REGISTRY=$(echo "$ECR_REPO" | cut -d'/' -f1)

# --- 1. Build and push server image ---
echo ""
echo "=== Building server Docker image ==="
docker build --platform linux/amd64 -t learnbright-api -f "$PROJECT_DIR/server/Dockerfile.prod" "$PROJECT_DIR/server"

echo "=== Pushing to ECR ==="
aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin "$ECR_REGISTRY"
docker tag learnbright-api:latest "$ECR_REPO:latest"
docker push "$ECR_REPO:latest"

# --- 2. Deploy to ECS ---
echo ""
echo "=== Updating ECS service ==="
aws ecs update-service \
  --cluster "$ECS_CLUSTER" \
  --service "$ECS_SERVICE" \
  --force-new-deployment \
  --region "$REGION" \
  --no-cli-pager

# --- 3. Build and deploy frontend (inside Docker to avoid native binding issues) ---
echo ""
echo "=== Building frontend ==="
rm -rf "$PROJECT_DIR/client/dist"
docker build -f "$PROJECT_DIR/client/Dockerfile.prod" --output "$PROJECT_DIR/client/dist" "$PROJECT_DIR/client"

echo "=== Uploading to S3 ==="
aws s3 sync "$PROJECT_DIR/client/dist/" "s3://$S3_BUCKET" --delete --region "$REGION"

# --- 4. Invalidate CloudFront cache ---
echo ""
echo "=== Invalidating CloudFront cache ==="
aws cloudfront create-invalidation \
  --distribution-id "$CF_DIST_ID" \
  --paths "/*" \
  --no-cli-pager

echo ""
echo "=== Deploy complete! ==="
echo "Site: https://d4v70wrw2tmc4.cloudfront.net"
