import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as elb2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as ecs from "@aws-cdk/aws-ecs";

/**
 * @description ecs.ClusterProps https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-ecs/clusterprops.html#aws_ecs_ClusterProps
 */
export interface EcsFargateClusterStackProps extends cdk.StackProps {
  readonly vpc: ec2.Vpc;
  readonly clusterName?: string;
  readonly containerInsights?: boolean;

  readonly loadBalancerName?: string;
  readonly securityGrp: ec2.SecurityGroup;
  
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
export class EcsFargateClusterStack extends cdk.Stack {
  readonly cluster: ecs.Cluster;
  readonly alb: elb2.ApplicationLoadBalancer;
  readonly fgservice: ecs.FargateService;
  readonly loadBalancerListener: elb2.ApplicationListener;
  public readonly targetGroup: elb2.ApplicationTargetGroup;

  constructor(scope: cdk.Construct, id: string, props: EcsFargateClusterStackProps) {
    super(scope, id, props);
      
    /**
     * 1. ECS Cluster
     */
    this.cluster = new ecs.Cluster(this, id + "-Cluster", {
      vpc: props.vpc,
      clusterName: props.clusterName ?? id + "-Cluster",
      containerInsights: props.containerInsights ?? true
    });

    /**
     * 2. ApplicationLoadBalancer
     */
    this.alb = new elb2.ApplicationLoadBalancer(
      this,
      id + '-alb',
      {
        vpc: props.vpc,
        internetFacing: true,
        ipAddressType: elb2.IpAddressType.IPV4,
        securityGroup: props.securityGrp,
        vpcSubnets: props.vpc.selectSubnets({
          subnetType: ec2.SubnetType.PUBLIC,
        }),
        loadBalancerName: props.loadBalancerName ?? id + '-alb',
      }
    );

    /**
     * 3. Application TargetGroup
     */
    const targetGrp = new elb2.ApplicationTargetGroup(
      this,
      id + '-TGrp',
      {
        vpc: props.vpc,
        protocol: elb2.ApplicationProtocol.HTTP,
        port: props.allowPort,
        targetType: elb2.TargetType.IP,
        targetGroupName: props.targetGroupName ?? id + '-TGrp',
      }
    );

    /**
     * 4. Application addListener
     */
    
    this.loadBalancerListener = this.alb.addListener("Listener", {
      protocol: elb2.ApplicationProtocol.HTTP,
      port: props.allowPort,
      open: true,
      defaultTargetGroups: [targetGrp],
    });
    
    /**
     * 5. CloudFormation Output
     */
    new cdk.CfnOutput(this, "ApplicationLoadBalancer DNS", {
      value: this.alb.loadBalancerDnsName,
    });

  }
}