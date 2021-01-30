import * as cdk from '@aws-cdk/core';

import { Vpc } from "../lib/vpc";

import { applicationMetaData } from "../configurations/config";

import { EcsFargateClusterStack } from "../lib/ecs-fargate-cluster-stack";
import { EcsFargateServiceStack } from "../lib/ecs-fargate-service-stack";
import { FargateAutoscalerStack } from "../lib/fargate-autoscaler";

export class RootStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        /** Step 1. VPC */
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

        /** Step 3. React App scale**/
        // const fargateAutoscalerStack = new FargateAutoscalerStack(this, applicationMetaData.FargateAutoscalerStackName , {
        //     vpc: vpc.vpc,
        //     cluster: ecsFargateCluster.cluster,
        //     fgService: react.fgservice,
        //     disableScaleIn: true,
        //     scaleType: 'Ram',
        // });

    }
}
