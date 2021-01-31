"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsFargateStack = void 0;
const cdk = require("@aws-cdk/core");
const vpc_construct_1 = require("../lib/vpc-construct");
const config_1 = require("../configurations/config");
const ecs_fargate_cluster_construct_1 = require("./ecs-fargate-cluster-construct");
const ecs_fargate_service_construct_1 = require("./ecs-fargate-service-construct");
class EcsFargateStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const vpc = new vpc_construct_1.VpcConstruct(this, config_1.applicationMetaData.vpcStackName, {
            maxAzs: config_1.applicationMetaData.maxAzs,
            cidr: config_1.applicationMetaData.cidr,
            ports: config_1.applicationMetaData.publicPort,
            natGateways: 1,
            useDefaultVpc: config_1.applicationMetaData.useDefaultVpc,
            vpcId: config_1.applicationMetaData.vpcId,
            useExistVpc: config_1.applicationMetaData.useExistVpc,
            env: {
                account: process.env.CDK_DEFAULT_ACCOUNT,
                region: process.env.CDK_DEFAULT_REGION
            },
        });
        /** Step 2. ECS */
        const ecsFargateCluster = new ecs_fargate_cluster_construct_1.EcsFargateClusterConstruct(this, config_1.applicationMetaData.ecsClusterStackName, {
            vpc: vpc.vpc,
            securityGrp: vpc.securityGrp,
            allowPort: config_1.applicationMetaData.TgrAllowPort,
            clusterName: config_1.applicationMetaData.clusterName,
        });
        /** React frontend >> Public Subnet **/
        const react = new ecs_fargate_service_construct_1.EcsFargateServiceConstruct(this, "FRONTEND" + config_1.applicationMetaData.ECSServiceStackName, {
            alb: ecsFargateCluster.alb,
            loadBalancerListener: ecsFargateCluster.loadBalancerListener,
            cluster: ecsFargateCluster.cluster,
            codelocation: config_1.applicationMetaData.reactCodeLocation,
            containerPort: config_1.applicationMetaData.containerPort,
            hostPort: config_1.applicationMetaData.TgrAllowPort,
            priority: 1,
            pathPattern: "/*",
        });
        /** nodejs >> Private Subnet **/
        const node = new ecs_fargate_service_construct_1.EcsFargateServiceConstruct(this, "BACKEND" + config_1.applicationMetaData.ECSServiceStackName, {
            alb: ecsFargateCluster.alb,
            loadBalancerListener: ecsFargateCluster.loadBalancerListener,
            cluster: ecsFargateCluster.cluster,
            codelocation: config_1.applicationMetaData.nodeJsCodeLocation,
            containerPort: config_1.applicationMetaData.containerPort,
            hostPort: config_1.applicationMetaData.TgrAllowPort,
            subnetPrivate: true,
            priority: 2,
            pathPattern: "/node/*",
        });
    }
}
exports.EcsFargateStack = EcsFargateStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWZhcmdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlY3MtZmFyZ2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBcUM7QUFFckMsd0RBQW9EO0FBRXBELHFEQUErRDtBQUcvRCxtRkFBNkU7QUFDN0UsbUZBQTZFO0FBSTdFLE1BQWEsZUFBZ0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUUxQyxZQUFZLEtBQWMsRUFBRSxFQUFVO1FBRWxDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFHakIsTUFBTSxHQUFHLEdBQUcsSUFBSSw0QkFBWSxDQUFDLElBQUksRUFBRSw0QkFBbUIsQ0FBQyxZQUFZLEVBQUU7WUFDakUsTUFBTSxFQUFFLDRCQUFtQixDQUFDLE1BQU07WUFDbEMsSUFBSSxFQUFFLDRCQUFtQixDQUFDLElBQUk7WUFDOUIsS0FBSyxFQUFFLDRCQUFtQixDQUFDLFVBQVU7WUFDckMsV0FBVyxFQUFFLENBQUM7WUFDZCxhQUFhLEVBQUUsNEJBQW1CLENBQUMsYUFBYTtZQUNoRCxLQUFLLEVBQUUsNEJBQW1CLENBQUMsS0FBSztZQUNoQyxXQUFXLEVBQUUsNEJBQW1CLENBQUMsV0FBVztZQUM1QyxHQUFHLEVBQUU7Z0JBQ0QsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO2dCQUN4QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0I7YUFDekM7U0FDSixDQUFDLENBQUM7UUFFSCxrQkFBa0I7UUFDbEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLDBEQUEwQixDQUFDLElBQUksRUFBRSw0QkFBbUIsQ0FBQyxtQkFBbUIsRUFBRTtZQUNwRyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUc7WUFDWixXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVc7WUFDNUIsU0FBUyxFQUFFLDRCQUFtQixDQUFDLFlBQVk7WUFDM0MsV0FBVyxFQUFFLDRCQUFtQixDQUFDLFdBQVc7U0FDL0MsQ0FBQyxDQUFDO1FBRUgsdUNBQXVDO1FBQ3ZDLE1BQU0sS0FBSyxHQUFHLElBQUksMERBQTBCLENBQUMsSUFBSSxFQUFFLFVBQVUsR0FBRyw0QkFBbUIsQ0FBQyxtQkFBbUIsRUFBRTtZQUNyRyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsR0FBRztZQUMxQixvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQyxvQkFBb0I7WUFDNUQsT0FBTyxFQUFFLGlCQUFpQixDQUFDLE9BQU87WUFDbEMsWUFBWSxFQUFFLDRCQUFtQixDQUFDLGlCQUFpQjtZQUNuRCxhQUFhLEVBQUUsNEJBQW1CLENBQUMsYUFBYTtZQUNoRCxRQUFRLEVBQUUsNEJBQW1CLENBQUMsWUFBWTtZQUMxQyxRQUFRLEVBQUUsQ0FBQztZQUNYLFdBQVcsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUVILGdDQUFnQztRQUNoQyxNQUFNLElBQUksR0FBRyxJQUFJLDBEQUEwQixDQUFDLElBQUksRUFBRSxTQUFTLEdBQUcsNEJBQW1CLENBQUMsbUJBQW1CLEVBQUU7WUFDbkcsR0FBRyxFQUFFLGlCQUFpQixDQUFDLEdBQUc7WUFDMUIsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUMsb0JBQW9CO1lBQzVELE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxPQUFPO1lBQ2xDLFlBQVksRUFBRSw0QkFBbUIsQ0FBQyxrQkFBa0I7WUFDcEQsYUFBYSxFQUFFLDRCQUFtQixDQUFDLGFBQWE7WUFDaEQsUUFBUSxFQUFFLDRCQUFtQixDQUFDLFlBQVk7WUFDMUMsYUFBYSxFQUFFLElBQUk7WUFDbkIsUUFBUSxFQUFFLENBQUM7WUFDWCxXQUFXLEVBQUUsU0FBUztTQUN6QixDQUFDLENBQUM7SUFJUCxDQUFDO0NBQ0o7QUF6REQsMENBeURDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcblxuaW1wb3J0IHsgVnBjQ29uc3RydWN0IH0gZnJvbSBcIi4uL2xpYi92cGMtY29uc3RydWN0XCI7XG5cbmltcG9ydCB7IGFwcGxpY2F0aW9uTWV0YURhdGEgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbnMvY29uZmlnXCI7XG4gIFxuIFxuaW1wb3J0IHsgRWNzRmFyZ2F0ZUNsdXN0ZXJDb25zdHJ1Y3QgfSBmcm9tIFwiLi9lY3MtZmFyZ2F0ZS1jbHVzdGVyLWNvbnN0cnVjdFwiO1xuaW1wb3J0IHsgRWNzRmFyZ2F0ZVNlcnZpY2VDb25zdHJ1Y3QgfSBmcm9tIFwiLi9lY3MtZmFyZ2F0ZS1zZXJ2aWNlLWNvbnN0cnVjdFwiO1xuXG5cblxuZXhwb3J0IGNsYXNzIEVjc0ZhcmdhdGVTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykgeyAgXG5cbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuXG4gICAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGNDb25zdHJ1Y3QodGhpcywgYXBwbGljYXRpb25NZXRhRGF0YS52cGNTdGFja05hbWUsIHtcbiAgICAgICAgICAgIG1heEF6czogYXBwbGljYXRpb25NZXRhRGF0YS5tYXhBenMsXG4gICAgICAgICAgICBjaWRyOiBhcHBsaWNhdGlvbk1ldGFEYXRhLmNpZHIsXG4gICAgICAgICAgICBwb3J0czogYXBwbGljYXRpb25NZXRhRGF0YS5wdWJsaWNQb3J0LFxuICAgICAgICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICAgICAgICB1c2VEZWZhdWx0VnBjOiBhcHBsaWNhdGlvbk1ldGFEYXRhLnVzZURlZmF1bHRWcGMsXG4gICAgICAgICAgICB2cGNJZDogYXBwbGljYXRpb25NZXRhRGF0YS52cGNJZCxcbiAgICAgICAgICAgIHVzZUV4aXN0VnBjOiBhcHBsaWNhdGlvbk1ldGFEYXRhLnVzZUV4aXN0VnBjLFxuICAgICAgICAgICAgZW52OiB7XG4gICAgICAgICAgICAgICAgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCxcbiAgICAgICAgICAgICAgICByZWdpb246IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTiBcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKiBTdGVwIDIuIEVDUyAqL1xuICAgICAgICBjb25zdCBlY3NGYXJnYXRlQ2x1c3RlciA9IG5ldyBFY3NGYXJnYXRlQ2x1c3RlckNvbnN0cnVjdCh0aGlzLCBhcHBsaWNhdGlvbk1ldGFEYXRhLmVjc0NsdXN0ZXJTdGFja05hbWUsIHtcbiAgICAgICAgICAgIHZwYzogdnBjLnZwYyxcbiAgICAgICAgICAgIHNlY3VyaXR5R3JwOiB2cGMuc2VjdXJpdHlHcnAsXG4gICAgICAgICAgICBhbGxvd1BvcnQ6IGFwcGxpY2F0aW9uTWV0YURhdGEuVGdyQWxsb3dQb3J0LFxuICAgICAgICAgICAgY2x1c3Rlck5hbWU6IGFwcGxpY2F0aW9uTWV0YURhdGEuY2x1c3Rlck5hbWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKiBSZWFjdCBmcm9udGVuZCA+PiBQdWJsaWMgU3VibmV0ICoqL1xuICAgICAgICBjb25zdCByZWFjdCA9IG5ldyBFY3NGYXJnYXRlU2VydmljZUNvbnN0cnVjdCh0aGlzLCBcIkZST05URU5EXCIgKyBhcHBsaWNhdGlvbk1ldGFEYXRhLkVDU1NlcnZpY2VTdGFja05hbWUsIHtcbiAgICAgICAgICAgIGFsYjogZWNzRmFyZ2F0ZUNsdXN0ZXIuYWxiLFxuICAgICAgICAgICAgbG9hZEJhbGFuY2VyTGlzdGVuZXI6IGVjc0ZhcmdhdGVDbHVzdGVyLmxvYWRCYWxhbmNlckxpc3RlbmVyLFxuICAgICAgICAgICAgY2x1c3RlcjogZWNzRmFyZ2F0ZUNsdXN0ZXIuY2x1c3RlcixcbiAgICAgICAgICAgIGNvZGVsb2NhdGlvbjogYXBwbGljYXRpb25NZXRhRGF0YS5yZWFjdENvZGVMb2NhdGlvbixcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IGFwcGxpY2F0aW9uTWV0YURhdGEuY29udGFpbmVyUG9ydCxcbiAgICAgICAgICAgIGhvc3RQb3J0OiBhcHBsaWNhdGlvbk1ldGFEYXRhLlRnckFsbG93UG9ydCxcbiAgICAgICAgICAgIHByaW9yaXR5OiAxLFxuICAgICAgICAgICAgcGF0aFBhdHRlcm46IFwiLypcIixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqIG5vZGVqcyA+PiBQcml2YXRlIFN1Ym5ldCAqKi9cbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBFY3NGYXJnYXRlU2VydmljZUNvbnN0cnVjdCh0aGlzLCBcIkJBQ0tFTkRcIiArIGFwcGxpY2F0aW9uTWV0YURhdGEuRUNTU2VydmljZVN0YWNrTmFtZSwge1xuICAgICAgICAgICAgYWxiOiBlY3NGYXJnYXRlQ2x1c3Rlci5hbGIsXG4gICAgICAgICAgICBsb2FkQmFsYW5jZXJMaXN0ZW5lcjogZWNzRmFyZ2F0ZUNsdXN0ZXIubG9hZEJhbGFuY2VyTGlzdGVuZXIsXG4gICAgICAgICAgICBjbHVzdGVyOiBlY3NGYXJnYXRlQ2x1c3Rlci5jbHVzdGVyLFxuICAgICAgICAgICAgY29kZWxvY2F0aW9uOiBhcHBsaWNhdGlvbk1ldGFEYXRhLm5vZGVKc0NvZGVMb2NhdGlvbixcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IGFwcGxpY2F0aW9uTWV0YURhdGEuY29udGFpbmVyUG9ydCxcbiAgICAgICAgICAgIGhvc3RQb3J0OiBhcHBsaWNhdGlvbk1ldGFEYXRhLlRnckFsbG93UG9ydCxcbiAgICAgICAgICAgIHN1Ym5ldFByaXZhdGU6IHRydWUsXG4gICAgICAgICAgICBwcmlvcml0eTogMixcbiAgICAgICAgICAgIHBhdGhQYXR0ZXJuOiBcIi9ub2RlLypcIixcbiAgICAgICAgfSk7XG5cblxuXG4gICAgfVxufSJdfQ==