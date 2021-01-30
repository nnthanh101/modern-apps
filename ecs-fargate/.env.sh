#!/bin/bash
 
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

function _logger() {
    echo -e "$(date) ${YELLOW}[*] $@ ${NC}"
}

echo
echo "#########################################################"
_logger "[+] [START] Setting up Lab account"
echo "#########################################################"
echo
 
echo
echo "#########################################################" 
_logger "[+] [START] Setting up Env variable"
echo "#########################################################"
echo

export PROJECT_ID=devsecops

## 1.1 Configuring AWS
## Linux(Ubuntu)
export AWS_ACCOUNT=$(aws sts get-caller-identity --output text --query Account)
export AWS_REGION=${AWS_REGION:-"us-east-1"}
export CDK_DEFAULT_ACCOUNT=$(aws sts get-caller-identity --output text --query Account)
export CDK_DEFAULT_REGION=${AWS_REGION:-"us-east-1"}
## Cloud9
# export AWS_ACCOUNT=$(aws sts get-caller-identity --output text --query Account)
# export AWS_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r '.region')

## 2. AWS Infra: S3, VPC 
export AWS_S3_BUCKET=${PROJECT_ID}-${AWS_ACCOUNT}
export AWS_VPC_NAME=${PROJECT_ID}-VPC
export AWS_VPC_CIDR="10.0.0.0/18"

export AWS_CDK_STACK="EcsFargateStack"
# export RDS_DATABASE_STACK='RDS-Database-Stack'
# export RDS_DATABASE_NAME='RDS-DB'
# export EFS_STACK='EFS-Stack'

## 3.1. Configuring ECR
export CONTAINER_REGISTRY_URL=${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com
# export ECR_REPOSITORY_FRONTEND=react
# export ECR_REPOSITORY_BACKEND=aspnet_mvc
export ECR_REPOSITORY=docker_asp

## 3.2. Configuring DockerHub
export DOCKER_REGISTRY_NAMESPACE=tanthanhkid
export HTTPS_GIT_REPO_URL=https://github.com/nnthanh101/cdk.git
export DOCKER_REGISTRY_USERNAME=tanthanhkid
# export DOCKER_REGISTRY_PASSWORD=<_DOCKERHUB_PASSWORD__
export DOCKER_REGISTRY_EMAIL=tanthanhkid@gmail.com

## 4. Primary domain
export PRIMARY_DOMAIN=tanthanhkid.github.io

echo
echo "#########################################################"
_logger "[+] [END] Setting up Env variable"
echo "#########################################################"
echo
