import * as core from "@aws-cdk/core";
import { Cluster } from "@aws-cdk/aws-ecs";
import { Vpc } from "@aws-cdk/aws-ec2";

export interface EcsClusterStackProps {
  readonly vpc: Vpc;
  readonly clusterName: string;
  readonly tags?: {
    [key: string]: string;
  };
}

/**
 * Creating ECS cluster
 */
export class EcsClusterStack extends core.Stack {
  readonly cluster: Cluster;

  constructor(parent: core.App, name: string, props: EcsClusterStackProps) {
    super(parent, name, {
      tags: props.tags,
    });

    this.cluster = new Cluster(this, "Cluster", {
      vpc: props.vpc,
      clusterName: props.clusterName,
    });
  }
}
