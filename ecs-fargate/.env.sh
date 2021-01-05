export AWS_ACCOUNT=$(aws sts get-caller-identity | jq -r '.Account' | tr -d '\n')
export AWS_REGION=${AWS_REGION:-"ap-southeast-1"}

export CONTAINER_REGISTRY_URL=${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com
export ECR_REPOSITORY=springboot

export DOCKER_REGISTRY_NAMESPACE=nnthanh101
export DOCKER_REGISTRY_USERNAME=nnthanh101
export DOCKER_REGISTRY_PASSWORD=Miracle@101
export DOCKER_REGISTRY_EMAIL=nnthanh101@gmail.com

export APP_VERSION=0.0.1