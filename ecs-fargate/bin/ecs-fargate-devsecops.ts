#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";

import { EcsFargateServiceStack } from "../lib/ecs-fargate-service-stack";
import { EcsFargateBackEndStack } from "../lib/ecs-fargate-backend-stack";
import { FargatePipelineStack } from "../lib/ecs-pipeline";
import { VpcStack } from "../lib/vpc-stack";
import { FargateAutoscalerStack } from "../lib/fargate-autoscaler";
import { EcsFargateClusterStack }  from "../lib/ecs-fargate-cluster-stack";
import { RDSMysqmStack } from "../lib/rds-mysql-stack";

/**  DevAx SpringBoot Stacks */
const app = new cdk.App();

const vpc = new VpcStack(app, "VpcStack", {
  maxAzs: 2,
  cidr: "10.10.0.0/18",
  ports: [80, 443, 3036],
  natGateways: 1
});

const ecsFargateCluster = new EcsFargateClusterStack(app, "EcsFargateClusterStack", {
  vpc: vpc.vpc,
  securityGrp: vpc.securityGrp,
  allowPort: 80,
  clusterName: "EcsFargateClusterStack",
});

/** React frontend >> Public Subnet **/
const react = new EcsFargateServiceStack(app, "ReactAppStack", {
  alb: ecsFargateCluster.alb,
  loadBalancerListener: ecsFargateCluster.loadBalancerListener,
  cluster: ecsFargateCluster.cluster,
  codelocation: "react",
  containerPort: 80,
  hostPort: 80,
  priority: 1,
  pathPattern: "/react/*",
});

/** SpringBoot backend >> Private Subnet **/
const springBoot = new EcsFargateServiceStack(app, "SpringBootStack", {
  alb: ecsFargateCluster.alb,
  loadBalancerListener: ecsFargateCluster.loadBalancerListener,
  cluster: ecsFargateCluster.cluster,
  codelocation: "springboot",
  containerPort: 80,
  hostPort: 80,
  priority: 2,
  pathPattern: "/springboot/*",
});

/** 
 * React 3000:3000
 * fargateAutoscalerStack(Connection)
 * CodePineline 1 
 */

/** React App scale**/
const fargateAutoscalerStack = new FargateAutoscalerStack(app, "FargateAutoscalerStack", {
  vpc: vpc.vpc,
  cluster: ecsFargateCluster.cluster,
  fgService: react.fgservice,
  disableScaleIn: true,
  scaleType: 'Ram',
});

// /** React App Pipeline**/
// const fargatePipelineStackReact = new FargatePipelineStack(app, 'FargatePipelineStack1', {
//     fgservice: react.fgservice,
// });


/** 
 * SpringBoot 80:80
 * fargateAutoscalerStack(CPU)
 * CodePineline 2 
 */
// const springboot = new EcsFargateServiceStack(app, "springboot", {
//   alb: ecsFargateCluster.alb,
//   cluster: ecsFargateCluster.cluster,
//   loadBalancerListener: ecsFargateCluster.loadBalancerListener,
//   codelocation: "react",
//   containerPort: 80,
//   hostPort: 80,
//   priority: 1,
//   pathPattern: "/react/*",
// });

/**
 * React 3000:3000  <-- fargateAutoscalerStack(Connection) + CodePineline 1
 *
 * SpringBoot 80:80 <-- fargateAutoscalerStack(CPU) + CodePineline 2
 *
 * MySQL :3306
 */
// const ecsFargateBackend = new EcsFargateBackEndStack(app, 'EcsFargateBackEndStack', {
//     vpc: vpc.vpc,
//     securityGrp: vpc.securityGrp,
//     codelocation: ["react", "springboot"],
//     containerPort: 80,
//     hostPort: 80,
//     dbPort: 3306,
//     secretUser: 'admin',
//     secretgenerateStringKey: 'password',
//     dbDatabaseName: 'mysql'
//     // alb: ecsFargate.alb
// });


/**
 * RAM, CPU, Connection
 */
// const fargateAutoscalerStack = new FargateAutoscalerStack(app, "FargateAutoscalerStack", {
//   vpc: vpc.vpc,
//   cluster: ecsFargateBackend.cluster,
//   fgService: ecsFargateBackend.listFargate[0],
//   disableScaleIn: true,
// });

// const fargatePipelineStack = new FargatePipelineStack(app, 'FargatePipelineStack', {
//     fgservice: ecsFargateBackend.listFargate[0]
// });

/* MySQL :3306 */
const dbmysql = new RDSMysqmStack(app, "MySQLStack", {
  vpc: vpc.vpc,
  securityGrp: vpc.securityGrp
});