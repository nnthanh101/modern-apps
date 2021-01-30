import cdk = require("@aws-cdk/core");
import * as ec2 from "@aws-cdk/aws-ec2";

export interface VpcProps {
  readonly cidr?: string;
  readonly maxAzs?: number;
  readonly natGateways?: number;
  readonly ports: number[];
  readonly tags?: {
    [key: string]: string;
  };

  readonly env: {
    account: string | undefined;
    region: string | undefined;
  }
  readonly vpcId: string;
  readonly useDefaultVpc: string;
  readonly useExistVpc: string;
}

/** 
 * Creating VPC
 */
export class Vpc extends cdk.Construct {
  public readonly vpc: ec2.IVpc; 
  readonly securityGrp: ec2.SecurityGroup;

  constructor(parent: cdk.Construct, id: string, props: VpcProps) {

    super(parent, id );

    if (props.useExistVpc === '1') {
      if (props.useDefaultVpc === '1') {
        this.vpc = ec2.Vpc.fromLookup(parent, id + '-VPC', { isDefault: true });
      } else {
        if (props.vpcId) {
          this.vpc = ec2.Vpc.fromLookup(parent, id + '-VPC', { isDefault: false, vpcId: props.vpcId });
        } else {
          this.vpc = this.createNewVpc(parent,props, id);
        }
      } 
    } else {
      this.vpc = this.createNewVpc(parent,props, id);
    }

    /** Get Elastic IP */
    this.vpc.publicSubnets.forEach((subnet, index) => {
      // Find the Elastic IP
      const EIP = subnet.node.tryFindChild('EIP') as ec2.CfnEIP
      new cdk.CfnOutput(parent, `output-eip-${index}`, { value: EIP.ref });
    });

    /**
   * Security Group
   */
    this.securityGrp = new ec2.SecurityGroup(parent, id + '-SecurityGroup', {
      allowAllOutbound: true,
      securityGroupName: 'HttpPublicSecurityGroup',
      vpc: this.vpc,
    });

    var self = this;
    props.ports.forEach(function(val){
      if (val != 0) {
        self.securityGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(val));
      }
    });


  }

  private createNewVpc(parent:cdk.Construct, props: VpcProps, id: string): ec2.IVpc {
    return new ec2.Vpc(parent, id + '-VPC', {
      cidr: props.cidr  ,
      maxAzs: props.maxAzs  ,
      subnetConfiguration: [
        {
          name: 'Public-DMZ', 
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'Private-Services', 
          subnetType: ec2.SubnetType.PRIVATE,
        },
      ],
      gatewayEndpoints: {
        S3: {
          service: ec2.GatewayVpcEndpointAwsService.S3,
        },
      },
    });
  }
}
