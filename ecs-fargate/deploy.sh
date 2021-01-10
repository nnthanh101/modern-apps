echo "==========================================================="
echo "==============SET ACCOUNT_ID and AWS_REGION================"
export ACCOUNT_ID=$(aws sts get-caller-identity --output text --query Account)
export AWS_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r '.region')

echo "=============SHOW ACCOUNT_ID and AWS_REGION================"

echo "export ACCOUNT_ID=${ACCOUNT_ID}"
echo "export AWS_REGION=${AWS_REGION}"
aws configure set default.region ${AWS_REGION}
aws configure get default.region

echo "====RUN cdk bootstrap aws://${ACCOUNT_ID}/${AWS_REGION}===="
cdk bootstrap aws://$ACCOUNT_ID/$AWS_REGION


echo "==================RUN cdk deploy==========================="

cdk deploy