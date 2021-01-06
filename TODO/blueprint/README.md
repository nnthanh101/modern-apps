# Provisioning of AWS VPC, EKS Cluster and GitOps CodePipeline 

```
source ../.env.sh
echo $AWS_ACCOUNT + $AWS_REGION + $AWS_VPC_NAME + $AWS_VPC_CIDR + $AWS_CLUSTER_NAME + $VPC_STACK + $AWS_INFRASTRUCTURE_STACK

rm -rf cdk.out/*.* cdk.context.json

npm run build 

## Generate `CDKToolkit` in CloudFormation 
cdk bootstrap aws://$AWS_ACCOUNT/$AWS_REGION

# cdk synth
# cdk synth $VPC_STACK
# cdk synth $AWS_INFRASTRUCTURE_STACK

# cdk deploy
cdk deploy $VPC_STACK
cdk deploy $AWS_INFRASTRUCTURE_STACK

# cdk destroy
cdk destroy $AWS_INFRASTRUCTURE_STACK
cdk destroy $VPC_STACK
```

1. The `AwsInfrastructureStack` which creates:
    1. The AWS VPC
    1. An IAM Role dedicated to cluster creation/administration to own the EKS Cluster.
    1. An EKS cluster (by running `eksctl` within `CodeBuild` based on the `buildspec.yml` and `cluster.yaml`)
    1. A Cloud9 with that IAM Role assigned to serve as a bastion/jumpbox.

1. The `AWSAppResourcesPipeline` which create a **CI/CD pipeline** to provision, and update based on any changes to the content of, the aws-app-resources folder.

Both stacks are defined in the `aws_infrastructure_stack.py` Python CDK file. 

If you don't want to install CDK to deploy I have taken the two CloudFormation templates it generates - `EnvironmentStack.template.json` and `ResourcesPipelineStack.template.json` - and put them in the folder ready for a standard CloudFormation Deployment as well. These stacks can be deployed into any region that supports both EKS in Fargate Mode as well as Cloud9.

Note that the **AwsInfrastructureStack** is not idempotent and it cannot be deployed a second time after it's creation. This is because it calls `eksctl` via CodeBuild in a configuration that will fail on re-run. As such I configure the CodePipline to do one initial run on creation then only re-run if invoked manually rather than true GitOps.

### Useful CDK commands

 * `cdk ls`          list all stacks in the app
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk docs`        open CDK documentation
 * `cdk destroy`     destroy this stack to your default AWS account/region

Enjoy!