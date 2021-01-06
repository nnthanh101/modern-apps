import * as core from "@aws-cdk/core";
import {
  FargateTaskDefinition,
  ContainerDefinition,
  ContainerImage,
  Protocol,
  Cluster,
  FargateService,
} from "@aws-cdk/aws-ecs";
import { SecurityGroup } from "@aws-cdk/aws-ec2";
import { Role } from "@aws-cdk/aws-iam";
export interface FargateTaskProps extends core.StackProps {
  readonly albPort: number;
  readonly memoryLimitMiB: number;
  readonly cpu: number;
  readonly codeLocaltion: string;
  readonly taskRole: Role;
  readonly cluster: Cluster;
  readonly securityGrp: SecurityGroup;
}

export class FargateTaskStack extends core.Stack {
  readonly fargate: FargateService;

  constructor(parent: core.App, name: string, props: FargateTaskProps) {
    super(parent, name, {
      ...props,
    });

    const taskDef = new FargateTaskDefinition(this, "Task-App-Definition", {
      memoryLimitMiB: 512,
      cpu: 256,
      executionRole: props.taskRole,
    });

    const appContainer = new ContainerDefinition(this, "AppContainer", {
      image: ContainerImage.fromRegistry(props.codeLocaltion),
      taskDefinition: taskDef,
    });

    appContainer.addPortMappings({
      hostPort: 80,
      containerPort: 3000,
      protocol: Protocol.TCP,
    });

    this.fargate = new FargateService(this, "Fargate-Service", {
      cluster: props.cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
      maxHealthyPercent: 200,
      minHealthyPercent: 100,
      securityGroup: props.securityGrp,
      assignPublicIp: true,
    });
  }
}
