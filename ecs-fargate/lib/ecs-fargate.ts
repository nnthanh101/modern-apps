
import * as cdk from "@aws-cdk/core";

import { VpcConstruct } from "../lib/vpc-construct";

import { applicationMetaData } from "../configurations/config";
  
 
import { EcsFargateClusterConstruct } from "./ecs-fargate-cluster-construct";
import { EcsFargateServiceConstruct } from "./ecs-fargate-service-construct";



export class EcsFargateStack extends cdk.Stack {

    constructor(scope: cdk.App, id: string) {  

        super(scope, id);


        const vpc = new VpcConstruct(this, applicationMetaData.vpcStackName, {
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
        const ecsFargateCluster = new EcsFargateClusterConstruct(this, applicationMetaData.ecsClusterStackName, {
            vpc: vpc.vpc,
            securityGrp: vpc.securityGrp,
            allowPort: applicationMetaData.TgrAllowPort,
            clusterName: applicationMetaData.clusterName,
        });

        /** React frontend >> Public Subnet **/
        const react = new EcsFargateServiceConstruct(this, "FRONTEND" + applicationMetaData.ECSServiceStackName, {
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
        const node = new EcsFargateServiceConstruct(this, "BACKEND" + applicationMetaData.ECSServiceStackName, {
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