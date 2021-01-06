import * as cdk from '@aws-cdk/core';

import * as dotenv from 'dotenv';
import * as ec2 from '@aws-cdk/aws-ec2';

export class AwsInfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // dotenv.config();

    /**
     * Step 1. use an existing VPC or create a new one for our AWS Infrastructure
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
  
  var vpc_name = process.env.AWS_VPC_NAME || "Production-VPC";
  var vpc_cidr = process.env.AWS_VPC_CIDR || "10.10.0.0/18";
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
                  name: "Public-DMZ"  },
                { cidrMask: 24, subnetType: ec2.SubnetType.PRIVATE, 
                  name: "Private-Services" } ]
            });  
      
  return vpc
}