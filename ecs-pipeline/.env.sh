export AWS_ACCOUNT=$(aws sts get-caller-identity | jq -r '.Account' | tr -d '\n')
export AWS_REGION=${AWS_REGION:-"ap-southeast-1"}
export IMAGE_TAG=latest
export IMAGE_REPO_NAME=aws-cdk/assets