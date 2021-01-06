+++
title = "EKS FargateCluster"
weight = 400
pre= "<b>2.2.4. </b>"
+++

### Step 1. Add a EKS-FargateCluster to your stack

* 🎯 EKS-FargateCluster ...


{{<highlight typescript "hl_lines=4-5 20-47">}}
import * as cdk from '@aws-cdk/core';

import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as eks from '@aws-cdk/aws-eks';

export class EksClusterStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    
    // Step 1. Create a new VPC for our EKS Cluster
    // The default VPC will create a NAT Gateway for each AZs --> Cost
    const vpc = new ec2.Vpc(this, 'EKS-FargateCluster-VPC', {
      cidr: '10.20.0.0/18',
      natGateways: 1
    })
    
    // Step 2. EKS Cluster with Fargate

    // IAM Role for our Fargate worker nodes
    const mastersRole = new iam.Role(this, 'masters-role', {
      assumedBy: new iam.AccountRootPrincipal()
    });

    const fargateProfileRole = new iam.Role(this, "fargate-profile-role", {
      assumedBy: new iam.ServicePrincipal("eks-fargate-pods.amazonaws.com"),
      managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEKSFargatePodExecutionRolePolicy")
      ]
    })

    const cluster = new eks.FargateCluster(this, "fargate-cluster", {
      clusterName: "EKS-FargateCluster",
      vpc,
      mastersRole,
      coreDnsComputeType: eks.CoreDnsComputeType.FARGATE,
      defaultProfile: {
          fargateProfileName: "default-profile",
          selectors: [
              { namespace: "default" },
              { namespace: "kube-system" }
          ],
          podExecutionRole: fargateProfileRole
      }
    });
    
  }
}
{{</highlight>}}


## Step 2. CDK Diff

Save your code, and let's take a quick look at the `cdk diff` before we deploy:

```
npm run build

cdk diff EksClusterStack
```


## Step 3. Let's deploy

```
cdk deploy EksClusterStack
```
