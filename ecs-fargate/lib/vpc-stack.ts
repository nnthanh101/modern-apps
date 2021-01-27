import * as cdk from "@aws-cdk/core";
import { Vpc, VpcProps, SubnetType, SecurityGroup, Port, GatewayVpcEndpointAwsService, CfnEIP } from "@aws-cdk/aws-ec2";

export interface VpcStackProps extends VpcProps {
  readonly cidr?: string;
  readonly maxAzs?: number;
  readonly natGateways?: number;
  readonly ports: number[];
  readonly tags?: {
    [key: string]: string;
  };
}

/**
 * @description Vpc https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-ec2/vpc.html#aws_ec2_Vpc
 * @description VpcProps https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-ec2/vpcprops.html#aws_ec2_VpcProps
 */
export class VpcStack extends cdk.Stack {
  readonly vpc: Vpc;
  readonly securityGrp: SecurityGroup;

  constructor(scope: cdk.Construct, id: string, props: VpcStackProps) {
    super(scope, id, props);
    
    /**
     * VPC
     */
    // if (props.natGateways == 0){
    //   /** NO NAT-Gateway --> reduce cost */
    //   this.vpc = new Vpc(this, id + '-VPC-Public', {
    //     cidr: props.cidr ?? '10.10.0.0/18',
    //     maxAzs: props.maxAzs ?? 2,
    //     natGateways: 0,
    //     subnetConfiguration: [
    //       {
    //         name: 'Public-DMZ',
    //         cidrMask: 24,
    //         subnetType: SubnetType.PUBLIC,
    //       }
    //     ],
    //     gatewayEndpoints: {
    //       S3: {
    //         service: GatewayVpcEndpointAwsService.S3,
    //       },
    //     },
    //   });
    // } else {
    // }
    this.vpc = new Vpc(this, id + '-VPC', {
      cidr: props.cidr ?? '10.10.0.0/18',
      maxAzs: props.maxAzs ?? 2,
      subnetConfiguration: [
        {
          name: 'Public-DMZ',
          cidrMask: 24,
          subnetType: SubnetType.PUBLIC,
        },
        {
          name: 'Private-Services',
          cidrMask: 24,
          subnetType: SubnetType.PRIVATE,
        },
      ],
      gatewayEndpoints: {
        S3: {
          service: GatewayVpcEndpointAwsService.S3,
        },
      },
    });
    
    /** Get Elastic IP */
    this.vpc.publicSubnets.forEach((subnet, index) => {
      // Find the Elastic IP
      const EIP = subnet.node.tryFindChild('EIP') as CfnEIP
      new cdk.CfnOutput(this, `output-eip-${index}`, { value: EIP.ref });
    })

    /**
     * Security Group
     */
    this.securityGrp = new SecurityGroup(this, id + '-SecurityGroup', {
      allowAllOutbound: true,
      securityGroupName: 'HttpPublicSecurityGroup',
      vpc: this.vpc,
    });
    
    var self = this;
    props.ports.forEach(function(val){
      if (val != 0) {
        self.securityGrp.connections.allowFromAnyIpv4(Port.tcp(val));
      }
    });

    new cdk.CfnOutput(this, 'VpcId', {
      value: this.vpc.vpcId,
      exportName: 'VpcId'
    })

  }
}
