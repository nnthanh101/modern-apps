import * as cdk from '@aws-cdk/core';

import * as dotenv from 'dotenv';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as eks from '@aws-cdk/aws-eks';

export class EksClusterStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    
    dotenv.config();

    /**
     * Step 1. Using an existing VPC or create a new one for our EKS Cluster
     */  
    const vpc = getOrCreateVpc(this);

    /**
     * Create a new VPC with single NAT-Gateway
     */
    // const vpc = new ec2.Vpc(this, 'EKS-VPC', {
    //   cidr: '10.20.0.0/18',
    //   natGateways: 1
    // });
    
    /**
    * Step 2. Creating a new EKS Cluster
    */  
    
    // IAM role for our EC2 worker nodes
    const clusterAdmin = new iam.Role(this, 'EKS-AdminRole', {
      assumedBy: new iam.AccountRootPrincipal()
    });

    var cluster_name = process.env.EKS_CLUSTER_NAME || "EKS-Cluster";
    // console.log(`cluster_name is ${process.env.EKS_CLUSTER_NAME}`);

    /** Create the Cluster and a default managed NodeGroup of 2 x m5.large */
    /* const cluster = new eks.Cluster(this, 'cluster-with-no-capacity', { 
       defaultCapacity: 0 }); */
    const cluster = new eks.Cluster(this, cluster_name, {
      clusterName: cluster_name,
      vpc,
      defaultCapacity: 1,
      defaultCapacityInstance: new ec2.InstanceType('t3.medium'),
      mastersRole: clusterAdmin,
      outputClusterName: true,
      version: eks.KubernetesVersion.V1_17,
    });
    
  }
}


/**
 * Step 1. use an existing VPC or create a new one for our EKS Cluster
 * 
 * Note: only 1 NAT Gateway --> Cost Optimization trade-off
 */ 
function getOrCreateVpc(stack: cdk.Stack): ec2.IVpc {
  
  var vpc_name = process.env.AWS_VPC_NAME || "EKS-VPC";
  var vpc_cidr = process.env.AWS_VPC_CIDR || "10.10.0.0/18";
  // console.log(`vpc_name is ${process.env.AWS_VPC_NAME}`);
  // console.log(`vpc_cidr is ${process.env.AWS_VPC_CIDR}`);
  // console.log(`vpc_name is ${process.env.AWS_VPC_MAX_AZ}`);
  // console.log(`vpc_cidr is ${process.env.AWS_VPC_NAT_GATEWAY}`);
  
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
