import * as core from "@aws-cdk/core";
import { Vpc , SubnetType, GatewayVpcEndpointAwsService, SecurityGroup, IVpc } from "@aws-cdk/aws-ec2";


export interface VPCStackProps extends core.StackProps {
  readonly maxAzs: number;
  readonly cidr: string;
  readonly vpcName: string;
  readonly tags?: {
    [key: string]: string;
  };
}

export class VPCStack extends core.Stack {
  readonly vpc: Vpc;
  constructor(parent: core.App, name: string, props: VPCStackProps) {
    super(parent, name, {
      ...props,
    });
    
    // const _vpc = Vpc.fromLookup(this, name, {
    //   vpcName: props.vpcName
    // });
    
    // print(_vpc);
    
    this.vpc = new Vpc(this, name, {
      maxAzs: props.maxAzs,
      cidr: props.cidr,
      subnetConfiguration: [
        {
          name: "Public-Subnet-App",
          cidrMask: 24,
          subnetType: SubnetType.PUBLIC,
        },
      ],
      gatewayEndpoints: {
        S3: {
          service: GatewayVpcEndpointAwsService.S3,
        },
      },
      natGateways: 1,
    });
  }
}