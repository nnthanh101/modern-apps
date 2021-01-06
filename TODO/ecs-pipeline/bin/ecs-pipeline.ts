#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";

import { Peer, Port, SecurityGroup, SubnetType, Vpc } from "@aws-cdk/aws-ec2";
import { Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import { VPCStack } from "../lib/vpc-stack";
import { EcsClusterStack } from "../lib/ecs-cluster";
import { ALBStack } from "../lib/alb-stack";
import { FargateTaskStack } from "../lib/fargate-stack";
import { EcsPipelineStack } from "../lib/ecs-pipeline-stack";
import { applicationMetaData } from "../configurations/config";
import { FargateFastAutoscalerStack } from "../lib/fargate-fa-autoscaler";
const app = new cdk.App();

console.log(process.env.AWS_ACCOUNT + ":" + process.env.AWS_REGION);

const ecsPipelineStack = new EcsPipelineStack(
  app,
  applicationMetaData.ecsStackName,
  {
    env: {
      account: process.env.AWS_ACCOUNT,
      region: process.env.AWS_REGION,
    },
  }
);

new FargateFastAutoscalerStack(app, "FargateFastAutoscalerStack", {
  // awsCliLayerArn: "",
  // awsCliLayerVersion: "",
  vpc: ecsPipelineStack.vpc,
  // sg: ecsPipelineStack.securityGrp,
  cluster: ecsPipelineStack.cluster,
  fgService: ecsPipelineStack.fgservice,
  disableScaleIn: true,
  env: {
      account: process.env.AWS_ACCOUNT,
      region: process.env.AWS_REGION,
    },
});
