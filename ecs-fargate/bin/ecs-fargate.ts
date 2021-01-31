#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";

import { Vpc } from "../lib/vpc";

import { applicationMetaData } from "../configurations/config";

import { EcsFargateClusterStack } from "../lib/ecs-fargate-cluster-stack";
import { EcsFargateServiceStack } from "../lib/ecs-fargate-service-stack";
import { FargateAutoscalerStack } from "../lib/fargate-autoscaler";

class EcsFargateConstruct extends cdk.Stack {

    constructor(scope: cdk.App, id: string) {

        super(scope, id);


        const vpc = new Vpc(this, applicationMetaData.vpcStackName, {
            maxAzs: applicationMetaData.maxAzs,
            cidr: applicationMetaData.cidr,
            ports: applicationMetaData.publicPort,
            natGateways: 1,
            useDefaultVpc: applicationMetaData.useDefaultVpc,
            vpcId: applicationMetaData.vpcId,
            useExistVpc: applicationMetaData.useExistVpc,
            env: {
                account: process.env.CDK_DEFAULT_ACCOUNT,
                region: process.env.CDK_DEFAULT_REGION
            },
        });

        /** Step 2. ECS */
        const ecsFargateCluster = new EcsFargateClusterStack(this, applicationMetaData.ecsClusterStackName, {
            vpc: vpc.vpc,
            securityGrp: vpc.securityGrp,
            allowPort: applicationMetaData.TgrAllowPort,
            clusterName: applicationMetaData.clusterName,
        });

        /** React frontend >> Public Subnet **/
        const react = new EcsFargateServiceStack(this, "FRONTEND" + applicationMetaData.ECSServiceStackName, {
            alb: ecsFargateCluster.alb,
            loadBalancerListener: ecsFargateCluster.loadBalancerListener,
            cluster: ecsFargateCluster.cluster,
            codelocation: applicationMetaData.reactCodeLocation,
            containerPort: applicationMetaData.containerPort,
            hostPort: applicationMetaData.TgrAllowPort,
            priority: 1,
            pathPattern: "/*",
        });

        /** nodejs >> Private Subnet **/
        const node = new EcsFargateServiceStack(this, "BACKEND" + applicationMetaData.ECSServiceStackName, {
            alb: ecsFargateCluster.alb,
            loadBalancerListener: ecsFargateCluster.loadBalancerListener,
            cluster: ecsFargateCluster.cluster,
            codelocation: applicationMetaData.nodeJsCodeLocation,
            containerPort: applicationMetaData.containerPort,
            hostPort: applicationMetaData.TgrAllowPort,
            subnetPrivate: true,
            priority: 2,
            pathPattern: "/node/*",
        });



    }
}


const app = new cdk.App();
new EcsFargateConstruct(app, 'EcsFargateStack1');