import * as cdk from "@aws-cdk/core"; 
import {   SubnetType } from "@aws-cdk/aws-ec2";
import { AwsLogDriver } from "@aws-cdk/aws-ecs";
import { Cluster, FargateService,  FargateTaskDefinition, ContainerDefinition, ContainerImage, Protocol} from "@aws-cdk/aws-ecs";
import { ServicePrincipal, Role, Policy, PolicyStatement, Effect, ManagedPolicy} from "@aws-cdk/aws-iam";
import {  ApplicationLoadBalancer, ApplicationListener} from "@aws-cdk/aws-elasticloadbalancingv2";

export interface EcsFargateServiceStackProps extends cdk.StackProps {
  readonly cluster: Cluster;
  readonly alb: ApplicationLoadBalancer;
  readonly loadBalancerListener: ApplicationListener;
  // FIXME
  // targetGroup: ApplicationTargetGroup;
  
  readonly codelocation: string;
  readonly containerPort: number;
  readonly hostPort: number;

  readonly roleNameFargate?: string;
  readonly policyNameFargate?: string;
  readonly memoryLimitMiB?: number;
  readonly cpu?: number;
  readonly desiredCount?: number;
  readonly maxHealthyPercent?: number;
  readonly minHealthyPercent?: number;
  readonly priority: number;
  readonly pathPattern: string;
  readonly subnetPrivate?: boolean;
  readonly tags?: {
    [key: string]: string;
  };
}
 
/**
 * ECS-Fargate Service Stack
 */
// export class EcsFargateServiceStack extends FargateService {
export class EcsFargateServiceStack extends cdk.Construct {
  readonly fgservice: FargateService;
  constructor(parent: cdk.Construct, id: string, props: EcsFargateServiceStackProps) {
    super(parent, id);
    
    /**
     * 1.ECS Task
     **/
    const taskRole = new Role(parent, id + "-Role", {
      assumedBy: new ServicePrincipal("ecs-tasks.amazonaws.com"),
      description: "Adds managed policies to ecs role for ecr image pulls and execution",
      roleName: props.roleNameFargate ?? id + "-Role",
    });
    
 
    const ecsPolicy: Policy = new Policy(parent,id+ "-Policy", {
      policyName: props.policyNameFargate ?? id + "-Policy",
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            "ecr:GetAuthorizationToken",
            "ecr:BatchCheckLayerAvailability",
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
            "logs:CreateLogStream",
            "logs:CreateLogGroup",
            "logs:PutLogEvents",
          ],
          resources: ["*"], 
        }),
      ],
    });

    taskRole.attachInlinePolicy(ecsPolicy);
    taskRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonEC2ContainerRegistryPowerUser"
      )
    );
    taskRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonECS_FullAccess")
    );
    taskRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsFullAccess")
    );

    /**
     * 5. ECS Task
     */

    /** 5.1. Create ECS Task definition */
    const taskDef = new FargateTaskDefinition(
      parent,
      id + "-FargateTaskDef",
      {
        memoryLimitMiB: props.memoryLimitMiB ,
        cpu: props.cpu ,
        executionRole: taskRole,
      }
    );

    /** 5.2. Add Container Docker-Image */
    const appContainer = new ContainerDefinition(
      parent,
      id + "-ContainerDef",
      { 
        image: ContainerImage.fromAsset(props.codelocation),
        taskDefinition: taskDef,
        logging: new AwsLogDriver({
          streamPrefix: id,
        }),
      }
    );

    /** 5.3. Port mapping */
    appContainer.addPortMappings({
      // hostPort: props.hostPort,
      containerPort: props.containerPort,
      protocol: Protocol.TCP,
    });

    /** 6. Create Fargate Service */
    this.fgservice = new FargateService(parent, id + "-FargateService", {
      cluster: props.cluster,
      taskDefinition: taskDef,
      desiredCount: props.desiredCount ,
      maxHealthyPercent: props.maxHealthyPercent ,
      minHealthyPercent: props.minHealthyPercent ,
      // securityGroup: props.securityGrp,
      assignPublicIp: true,
      vpcSubnets: { 
        subnetType: props.subnetPrivate ? SubnetType.PRIVATE: SubnetType.PUBLIC
      }
    });

    /**
     * FIXME Connect service to TargetGroup
     * NOTE: This does not introduce a cycle because ECS Services are self-registering.
     * (they point to the TargetGroup instead of the other way around).
     */ 
    // props.targetGroup.addTarget(this.fgservice);

    props.loadBalancerListener.addTargets(id + "-TargetGroup", {
      port: props.hostPort,
      targets: [this.fgservice],
      priority: props.priority,
      pathPattern: props.pathPattern,
    });

  }
}