#!/bin/bash
export PROJECT_ID=CDK

## 1. Configuring AWS
export AWS_ACCOUNT=$(aws sts get-caller-identity | jq -r '.Account' | tr -d '\n')
export AWS_REGION=${AWS_REGION:-"ap-southeast-1"}
# export AWS_ACCOUNT=$(aws sts get-caller-identity --output text --query Account)
# export AWS_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r '.region')
# export AWS_ACCESS_KEY_ID=""
# export AWS_SECRET_ACCESS_KEY=""

## 2. Configuring ECR
export CONTAINER_REGISTRY_URL=${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com
export ECR_REPOSITORY=deploy-eks

## 3. Configuring DockerHub
# export DOCKER_REGISTRY_NAMESPACE=nnthanh101
# export HTTPS_GIT_REPO_URL=https://github.com/nnthanh101/eks-pipeline.git
# export DOCKER_REGISTRY_USERNAME=nnthanh101
# export DOCKER_REGISTRY_PASSWORD=Your-DockerHub-Password
# export DOCKER_REGISTRY_EMAIL=nnthanh101@gmail.com

## 4. Route53 DNS for testing purpose
# export APP_DOMAIN=api.job4u.io

## 5. aws-infrastructure Stack
export AWS_INFRASTRUCTURE_STACK='AWS-Infrastructure-Stack'
export VPC_STACK='Production-VPC-Stack'
export AWS_VPC_NAME='Production-VPC'
export AWS_VPC_CIDR='10.0.0.0/18'

# export AWS_MANAGED_SERVICE_STACK='AWS-Managed-Services-Stack'
# export RDS_DATABASE_STACK='RDS-Database-Stack'
# export RDS_DATABASE_NAME='RDS-DB'

# export EFS_STACK='EFS-Stack'