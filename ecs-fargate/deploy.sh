#!/bin/bash
# set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

function _logger() {
    echo -e "$(date) ${YELLOW}[*] $@ ${NC}"
}

source ./.env.sh
# ./install-prerequisites.sh

started_time=$(date '+%d/%m/%Y %H:%M:%S')
echo
echo "#########################################################"
_logger "[+] Verify the prerequisites environment"
echo "#########################################################"
echo
## DEBUG
echo "[x] Verify AWS CLI": $(aws  --version)
echo "[x] Verify jq":      $(jq   --version)
echo "[x] Verify Docker":  $(docker version)
echo "[x] Verify CDK":     $(cdk  --version)
# echo "[x] Verify Node.js": $(node --version)
# echo "[x] Verify Python":  $(python -V)
# echo "[x] Verify Maven":   $(cdk  --version)
# https://aws.amazon.com/visualstudio/


echo $AWS_ACCOUNT + $AWS_REGION + $AWS_S3_BUCKET + $AWS_CDK_STACK
currentPrincipalArn=$(aws sts get-caller-identity --query Arn --output text)
## Just in case, you are using an IAM role, we will switch the identity from your STS arn to the underlying role ARN.
currentPrincipalArn=$(sed 's/\(sts\)\(.*\)\(assumed-role\)\(.*\)\(\/.*\)/iam\2role\4/' <<< $currentPrincipalArn)
echo $currentPrincipalArn

## Install node_modules typescript
# npm install

cdk bootstrap aws://${AWS_ACCOUNT}/${AWS_REGION} \
    --bootstrap-bucket-name ${AWS_S3_BUCKET}     \
    --termination-protection                     \
    --tags type=cdk-bootstrap 
## export CDK_NEW_BOOTSTRAP=1
## cdk bootstrap aws://${AWS_ACCOUNT}/${AWS_REGION} --show-template -v


echo
echo "#########################################################"
_logger "[+] [START] Deploy ECS-Fargate at ${started_time}"
echo "#########################################################"
echo

# 1. Deloy to DockerHub & ECR

echo
echo "#########################################################"
_logger "[+] 1. [AWS Infrastructure] S3, VPC, Cloud9"
echo "#########################################################"
echo

## DEBUG
## cd ecs-fargate
# rm -rf cdk.out/*.* cdk.context.json

echo
echo "#########################################################"
_logger "[+] 2.1. [ECR]Deploy ASP.NET MVC"
echo "#########################################################"
echo
 
# cd docker
# chmod 777 deploy-docker-ecr.sh 
# ./deploy-docker-ecr.sh 
 
echo
echo "#########################################################"
_logger "[+] 2.1. [ECR]Deploy Spring boot"
echo "#########################################################"
echo
 

# aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT}.dkr.ecr.${AWS_REGION}.amazonaws.com
 
npm run build
## cdk diff $AWS_CDK_STACK
# cdk synth $AWS_CDK_STACK
## cdk deploy $AWS_CDK_STACK --require-approval never 

cdk deploy --all --require-approval never

ended_time=$(date '+%d/%m/%Y %H:%M:%S')
echo
echo "#########################################################"
echo -e "${YELLOW} [END] ECS-Fargate at ${ended_time} - ${started_time} ${NC}"
echo "#########################################################"
echo
