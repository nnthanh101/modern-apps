import * as core from "@aws-cdk/core";
import {
  ApplicationLoadBalancer,
  IpAddressType,
  ApplicationProtocol,
} from "@aws-cdk/aws-elasticloadbalancingv2";
import { Vpc, SubnetType, SecurityGroup } from "@aws-cdk/aws-ec2";

export interface ALBStackProps extends core.StackProps {
  readonly albPort: number;
  readonly vpc: Vpc;
  readonly securityGrp: SecurityGroup;
}

export class ALBStack extends core.Stack {
  readonly alb: ApplicationLoadBalancer;

  constructor(parent: core.App, name: string, props: ALBStackProps) {
    super(parent, name, {
      ...props,
    });

    this.alb = new ApplicationLoadBalancer(this, "ECS-LoadBalancer", {
      vpc: props.vpc,
      internetFacing: true,
      ipAddressType: IpAddressType.IPV4,
      securityGroup: props.securityGrp,
      vpcSubnets: props.vpc.selectSubnets({
        subnetType: SubnetType.PUBLIC,
      }),
    });
    this.alb.addListener("Listener80", {
      protocol: ApplicationProtocol.HTTP,
      port: props.albPort,
      open: true,
    });
  }
}
