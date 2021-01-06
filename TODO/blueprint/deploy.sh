#!/bin/bash

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

function _logger() {
    echo -e "$(date) ${YELLOW}[*] $@ ${NC}"
}

source .env.sh

echo
echo "#########################################################"
_logger "[+] Verify the prerequisites environment"
echo "#########################################################"
echo

echo "[x] Verify Node.js": $(node --version)
echo "[x] Verify CDK": $(cdk --version)
# echo "[x] Verify Python": $(python -V)
# echo "[x] Verify Pip": $(pip -V)

currentPrincipalArn=$(aws sts get-caller-identity --query Arn --output text)
## Just in case, you are using an IAM role, we will switch the identity from your STS arn to the underlying role ARN.
currentPrincipalArn=$(sed 's/\(sts\)\(.*\)\(assumed-role\)\(.*\)\(\/.*\)/iam\2role\4/' <<< $currentPrincipalArn)
# echo $currentPrincipalArn
cdk bootstrap aws://$AWS_ACCOUNT/$AWS_REGION


started_time=$(date '+%d/%m/%Y %H:%M:%S')
echo
echo "#########################################################"
_logger "[+] [START] BLUEPRINT - starting at ${started_time}"
echo "#########################################################"
echo

echo
echo "#########################################################"
_logger "[+] 1. [Infra] VPCs: : Managment-VPC, Development-VPC, Production-VPC"
echo "#########################################################"
echo
npm run build
cdk deploy BlueprintStack --require-approval never


ended_time=$(date '+%d/%m/%Y %H:%M:%S')
echo
echo "#########################################################"
echo -e "${RED} [FINISH] BLUEPRINT - finished at ${ended_time} - ${started_time} ${NC}"
echo "#########################################################"
echo
