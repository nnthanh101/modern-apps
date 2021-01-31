import * as cdk from "@aws-cdk/core";
import {Vpc ,IVpc,SecurityGroup,SubnetType,GatewayVpcEndpointAwsService,CfnEIP,Port} from "@aws-cdk/aws-ec2";

export interface VpcStackProps extends cdk.StackProps {
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
export class VpcConstruct extends cdk.Construct {
  public readonly vpc: IVpc;
  readonly securityGrp: SecurityGroup;

  constructor(parent: cdk.Construct, id: string, props: VpcStackProps) {
    super(parent, id);

    if (props.useExistVpc === '1') {
      if (props.useDefaultVpc === '1') {
        this.vpc = Vpc.fromLookup(parent, id + '-VPC', { isDefault: true });
      } else {
        if (props.vpcId) {
          this.vpc = Vpc.fromLookup(parent, id + '-VPC', { isDefault: false, vpcId: props.vpcId });
        } else {
         this.vpc= new Vpc(parent, id + '-VPC', {
          cidr: props.cidr,
          maxAzs: props.maxAzs,
          subnetConfiguration: [
            {
              name: 'Public-DMZ',
              subnetType: SubnetType.PUBLIC,
            },
            {
              name: 'Private-Services',
              subnetType: SubnetType.PRIVATE,
            },
          ],
          gatewayEndpoints: {
            S3: {
              service: GatewayVpcEndpointAwsService.S3,
            },
          },
        });
        } 
      }
    } else {
      this.vpc = new Vpc(parent, id + '-VPC', {
        cidr: props.cidr,
        maxAzs: props.maxAzs,
        subnetConfiguration: [
          {
            name: 'Public-DMZ',
            subnetType: SubnetType.PUBLIC,
          },
          {
            name: 'Private-Services',
            subnetType: SubnetType.PRIVATE,
          },
        ],
        gatewayEndpoints: {
          S3: {
            service: GatewayVpcEndpointAwsService.S3,
          },
        },
      });
    }

    /** Get Elastic IP */
    this.vpc.publicSubnets.forEach((subnet, index) => {
      // Find the Elastic IP
      const EIP = subnet.node.tryFindChild('EIP') as CfnEIP
      new cdk.CfnOutput(parent, `output-eip-${index}`, { value: EIP.ref });
    });

    /**
   * Security Group
   */
    this.securityGrp = new SecurityGroup(parent, id + '-SecurityGroup', {
      allowAllOutbound: true,
      securityGroupName: 'HttpPublicSecurityGroup',
      vpc: this.vpc, 
    });

    var self = this;
    props.ports.forEach(function (val) { 
      if (val != 0) {
        self.securityGrp.connections.allowFromAnyIpv4(Port.tcp(val));
      }
    });


  }
 
}
