+++
title = "VPC"
weight = 100
pre= "<b>2.2.1. </b>"
+++


### Step 1. Add a **VPC** to your **EKS** stack:

* 🎯 Define the **VPC** that is used for EKS Cluster.
    * **1.** Add an **import** statement at the beginning of `aws-infrastructure/lib/aws-infrastructure-stack.ts`
    * **2.** Create an **aws-ec2.Vpc** ~~EKS-VPC~~ 
        * [x] VPC Name: ~~EKS-VPC~~
        * [x] VPC CIDR: ~~10.10.0.0/16~~
        * [x] Number of NAT Gateway: ~~1~~ ~~(Cost Optimization trade-off)~~
* 🎯  Environment Variables from `.env` file

  ```
  # ACCOUNT_ID=$(aws sts get-caller-identity --output text --query Account)
  # AWS_REGION=$(curl -s 169.254.169.254/latest/dynamic/instance-identity/document | jq -r '.region')

  AWS_VPC_NAME="EKS-VPC"
  AWS_VPC_CIDR="10.10.0.0/18"
  # AWS_VPC_MAX_AZ=2
  # AWS_VPC_NAT_GATEWAY=1

  EKS_CLUSTER_NAME="EKS-Cluster"
  EKS_CLUSTER_ROLE_NAME="EKS-Cluster-Role"

  ECR_REPOSITORY="eks-ecr-repo"
  CODECOMMIT_REPOSITORY="eks-codecommit-repo"
  ```

{{<highlight typescript "hl_lines=3-4 12 14-22 27-57">}}
import * as cdk from '@aws-cdk/core';

import * as dotenv from 'dotenv';
import * as ec2 from '@aws-cdk/aws-ec2';

export class EksClusterStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    
    dotenv.config();

    /**
     * Step 1. use an existing VPC or create a new one for our EKS Cluster
     */  
    /** DEBUG purpose ONLY!!! */
    // const vpc = new ec2.Vpc(this, 'Development-VPC', {
    //   cidr: '10.10.0.0/18',
    //   natGateways: 0
    // })
    const vpc = getOrCreateVpc(this);
    
  }
}

/**
 * Step 1. use an existing VPC or create a new one for our EKS Cluster
 * 
 * Note: only 1 NAT Gateway --> Cost Optimization trade-off
 */ 
function getOrCreateVpc(stack: cdk.Stack): ec2.IVpc {
  
  var vpc_name = process.env.AWS_VPC_NAME || "EKS-VPC";
  var vpc_cidr = process.env.AWS_VPC_CIDR || "10.10.0.0/16";
  // console.log(`vpc_name is ${process.env.AWS_VPC_NAME}`);
  // console.log(`vpc_cidr is ${process.env.AWS_VPC_CIDR}`);
  
  /** Use an existing VPC or create a new one */
  const vpc = stack.node.tryGetContext('use_default_vpc') === '1' ?
    ec2.Vpc.fromLookup(stack, vpc_name, { isDefault: true }) :
    stack.node.tryGetContext('use_vpc_id') ?
      ec2.Vpc.fromLookup(stack, vpc_name, 
        { vpcId: stack.node.tryGetContext('use_vpc_id') }) :
          new ec2.Vpc(stack, vpc_name, 
            { cidr: vpc_cidr,
              maxAzs: 2,
              natGateways: 1,
              subnetConfiguration: [
                { cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC,  
                  name: "PublicDMZ"  },
                { cidrMask: 24, subnetType: ec2.SubnetType.PRIVATE, 
                  name: "PrivateServices" } ]
            });  
      
  return vpc
}
{{</highlight>}}


## Step 2. CDK Diff

Save your code, and let's take a quick look at the `cdk diff` before we deploy:

```
npm run build

cdk diff $AWS_INFRASTRUCTURE_STACK
```


## Step 3. Let's deploy

```
cdk deploy $AWS_INFRASTRUCTURE_STACK
```

> {{%expand "✍️ Deploy in another AWS_REGION" %}} 

  ```bash
  # only for the first time in this region
  AWS_REGION=ap-southeast-2 cdk bootstrap
  # cdk diff
  AWS_REGION=ap-southeast-2 cdk diff
  AWS_REGION=ap-southeast-2 cdk deploy
  ```
{{% /expand%}}


> {{%expand "✍️ Deploy in any existing VPC" %}} 

  ```bash
  # To deploy in the default vpc
  cdk diff -c use_default_vpc=1
  # To deploy in a specific VPC ID
  cdk diff -c use_vpc_id=vpc-11111111111111111
  ```
{{% /expand%}}