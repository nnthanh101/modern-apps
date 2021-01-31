import * as cdk from "@aws-cdk/core";
import { IVpc, SecurityGroup, SubnetType } from "@aws-cdk/aws-ec2";
import { ApplicationLoadBalancer, ApplicationListener, ApplicationTargetGroup, IpAddressType, ApplicationProtocol, TargetType } from "@aws-cdk/aws-elasticloadbalancingv2";
import { Cluster, FargateService } from "@aws-cdk/aws-ecs";

/**
 * @description ecs.ClusterProps https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-ecs/clusterprops.html#aws_ecs_ClusterProps
 */
export interface EcsFargateClusterStackProps extends cdk.StackProps {
  readonly vpc: IVpc;
  readonly clusterName?: string;
  readonly containerInsights?: boolean;

  readonly loadBalancerName?: string;
  readonly securityGrp: SecurityGroup;

  readonly targetGroupName?: string;
  readonly allowPort: number;

  readonly tags?: {
    [key: string]: string;
  };
}

/**
 * VPC >> ECS Cluster
 * Shared Load Balancer: create an empty TargetGroup in the Shared ALB, and register a Service into it in the ServiceStack.
 */
export class EcsFargateClusterStack extends cdk.Construct {
  readonly cluster: Cluster;
  readonly alb: ApplicationLoadBalancer;
  readonly fgservice: FargateService;
  readonly loadBalancerListener: ApplicationListener;
  public readonly targetGroup: ApplicationTargetGroup;

  constructor(parent: cdk.Construct, id: string, props: EcsFargateClusterStackProps) {

    super(parent, id);

    /**
     * 1. ECS Cluster
     */
    this.cluster = new Cluster(parent, id + "-Cluster", {
      vpc: props.vpc,
      clusterName: props.clusterName ?? id + "-Cluster",
      containerInsights: props.containerInsights ?? true
    });

    /**
     * 2. ApplicationLoadBalancer
     */
    this.alb = new ApplicationLoadBalancer(
      parent,
      id + '-alb',
      {
        vpc: props.vpc,
        internetFacing: true,
        ipAddressType: IpAddressType.IPV4,
        securityGroup: props.securityGrp,
        vpcSubnets: props.vpc.selectSubnets({
          subnetType: SubnetType.PUBLIC,
        }),
        loadBalancerName: props.loadBalancerName ?? id + '-alb',
      }
    );

    /**
     * 3. Application TargetGroup
     */
    const targetGrp = new ApplicationTargetGroup(
      parent,
      id + '-TGrp',
      {
        vpc: props.vpc,
        protocol: ApplicationProtocol.HTTP,
        port: props.allowPort,
        targetType: TargetType.IP,
        targetGroupName: props.targetGroupName ?? id + '-TGrp',
      }
    );

    /**
     * 4. Application addListener
     */

    this.loadBalancerListener = this.alb.addListener("Listener", {
      protocol: ApplicationProtocol.HTTP,
      port: props.allowPort,
      open: true,
      defaultTargetGroups: [targetGrp],
    });

    /**
     * 5. CloudFormation Output
     */
    new cdk.CfnOutput(parent, "ApplicationLoadBalancer DNS", {
      value: this.alb.loadBalancerDnsName,
    });

  }
}