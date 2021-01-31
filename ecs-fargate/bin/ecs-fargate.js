#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const vpc_1 = require("../lib/vpc");
const config_1 = require("../configurations/config");
const ecs_fargate_cluster_stack_1 = require("../lib/ecs-fargate-cluster-stack");
const ecs_fargate_service_stack_1 = require("../lib/ecs-fargate-service-stack");
class EcsFargateConstruct extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const vpc = new vpc_1.Vpc(this, config_1.applicationMetaData.vpcStackName, {
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
        const ecsFargateCluster = new ecs_fargate_cluster_stack_1.EcsFargateClusterStack(this, config_1.applicationMetaData.ecsClusterStackName, {
            vpc: vpc.vpc,
            securityGrp: vpc.securityGrp,
            allowPort: config_1.applicationMetaData.TgrAllowPort,
            clusterName: config_1.applicationMetaData.clusterName,
        });
        /** React frontend >> Public Subnet **/
        const react = new ecs_fargate_service_stack_1.EcsFargateServiceStack(this, "FRONTEND" + config_1.applicationMetaData.ECSServiceStackName, {
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
        const node = new ecs_fargate_service_stack_1.EcsFargateServiceStack(this, "BACKEND" + config_1.applicationMetaData.ECSServiceStackName, {
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
const app = new cdk.App();
new EcsFargateConstruct(app, 'EcsFargateStack1');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWZhcmdhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlY3MtZmFyZ2F0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxxQ0FBcUM7QUFFckMsb0NBQWlDO0FBRWpDLHFEQUErRDtBQUUvRCxnRkFBMEU7QUFDMUUsZ0ZBQTBFO0FBRzFFLE1BQU0sbUJBQW9CLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFFdkMsWUFBWSxLQUFjLEVBQUUsRUFBVTtRQUVsQyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBR2pCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLElBQUksRUFBRSw0QkFBbUIsQ0FBQyxZQUFZLEVBQUU7WUFDeEQsTUFBTSxFQUFFLDRCQUFtQixDQUFDLE1BQU07WUFDbEMsSUFBSSxFQUFFLDRCQUFtQixDQUFDLElBQUk7WUFDOUIsS0FBSyxFQUFFLDRCQUFtQixDQUFDLFVBQVU7WUFDckMsV0FBVyxFQUFFLENBQUM7WUFDZCxhQUFhLEVBQUUsNEJBQW1CLENBQUMsYUFBYTtZQUNoRCxLQUFLLEVBQUUsNEJBQW1CLENBQUMsS0FBSztZQUNoQyxXQUFXLEVBQUUsNEJBQW1CLENBQUMsV0FBVztZQUM1QyxHQUFHLEVBQUU7Z0JBQ0QsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO2dCQUN4QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0I7YUFDekM7U0FDSixDQUFDLENBQUM7UUFFSCxrQkFBa0I7UUFDbEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGtEQUFzQixDQUFDLElBQUksRUFBRSw0QkFBbUIsQ0FBQyxtQkFBbUIsRUFBRTtZQUNoRyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUc7WUFDWixXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVc7WUFDNUIsU0FBUyxFQUFFLDRCQUFtQixDQUFDLFlBQVk7WUFDM0MsV0FBVyxFQUFFLDRCQUFtQixDQUFDLFdBQVc7U0FDL0MsQ0FBQyxDQUFDO1FBRUgsdUNBQXVDO1FBQ3ZDLE1BQU0sS0FBSyxHQUFHLElBQUksa0RBQXNCLENBQUMsSUFBSSxFQUFFLFVBQVUsR0FBRyw0QkFBbUIsQ0FBQyxtQkFBbUIsRUFBRTtZQUNqRyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsR0FBRztZQUMxQixvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQyxvQkFBb0I7WUFDNUQsT0FBTyxFQUFFLGlCQUFpQixDQUFDLE9BQU87WUFDbEMsWUFBWSxFQUFFLDRCQUFtQixDQUFDLGlCQUFpQjtZQUNuRCxhQUFhLEVBQUUsNEJBQW1CLENBQUMsYUFBYTtZQUNoRCxRQUFRLEVBQUUsNEJBQW1CLENBQUMsWUFBWTtZQUMxQyxRQUFRLEVBQUUsQ0FBQztZQUNYLFdBQVcsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUVILGdDQUFnQztRQUNoQyxNQUFNLElBQUksR0FBRyxJQUFJLGtEQUFzQixDQUFDLElBQUksRUFBRSxTQUFTLEdBQUcsNEJBQW1CLENBQUMsbUJBQW1CLEVBQUU7WUFDL0YsR0FBRyxFQUFFLGlCQUFpQixDQUFDLEdBQUc7WUFDMUIsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUMsb0JBQW9CO1lBQzVELE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxPQUFPO1lBQ2xDLFlBQVksRUFBRSw0QkFBbUIsQ0FBQyxrQkFBa0I7WUFDcEQsYUFBYSxFQUFFLDRCQUFtQixDQUFDLGFBQWE7WUFDaEQsUUFBUSxFQUFFLDRCQUFtQixDQUFDLFlBQVk7WUFDMUMsYUFBYSxFQUFFLElBQUk7WUFDbkIsUUFBUSxFQUFFLENBQUM7WUFDWCxXQUFXLEVBQUUsU0FBUztTQUN6QixDQUFDLENBQUM7SUFJUCxDQUFDO0NBQ0o7QUFHRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLG1CQUFtQixDQUFDLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5cbmltcG9ydCB7IFZwYyB9IGZyb20gXCIuLi9saWIvdnBjXCI7XG5cbmltcG9ydCB7IGFwcGxpY2F0aW9uTWV0YURhdGEgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbnMvY29uZmlnXCI7XG5cbmltcG9ydCB7IEVjc0ZhcmdhdGVDbHVzdGVyU3RhY2sgfSBmcm9tIFwiLi4vbGliL2Vjcy1mYXJnYXRlLWNsdXN0ZXItc3RhY2tcIjtcbmltcG9ydCB7IEVjc0ZhcmdhdGVTZXJ2aWNlU3RhY2sgfSBmcm9tIFwiLi4vbGliL2Vjcy1mYXJnYXRlLXNlcnZpY2Utc3RhY2tcIjtcbmltcG9ydCB7IEZhcmdhdGVBdXRvc2NhbGVyU3RhY2sgfSBmcm9tIFwiLi4vbGliL2ZhcmdhdGUtYXV0b3NjYWxlclwiO1xuXG5jbGFzcyBFY3NGYXJnYXRlQ29uc3RydWN0IGV4dGVuZHMgY2RrLlN0YWNrIHtcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG5cbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuXG4gICAgICAgIGNvbnN0IHZwYyA9IG5ldyBWcGModGhpcywgYXBwbGljYXRpb25NZXRhRGF0YS52cGNTdGFja05hbWUsIHtcbiAgICAgICAgICAgIG1heEF6czogYXBwbGljYXRpb25NZXRhRGF0YS5tYXhBenMsXG4gICAgICAgICAgICBjaWRyOiBhcHBsaWNhdGlvbk1ldGFEYXRhLmNpZHIsXG4gICAgICAgICAgICBwb3J0czogYXBwbGljYXRpb25NZXRhRGF0YS5wdWJsaWNQb3J0LFxuICAgICAgICAgICAgbmF0R2F0ZXdheXM6IDEsXG4gICAgICAgICAgICB1c2VEZWZhdWx0VnBjOiBhcHBsaWNhdGlvbk1ldGFEYXRhLnVzZURlZmF1bHRWcGMsXG4gICAgICAgICAgICB2cGNJZDogYXBwbGljYXRpb25NZXRhRGF0YS52cGNJZCxcbiAgICAgICAgICAgIHVzZUV4aXN0VnBjOiBhcHBsaWNhdGlvbk1ldGFEYXRhLnVzZUV4aXN0VnBjLFxuICAgICAgICAgICAgZW52OiB7XG4gICAgICAgICAgICAgICAgYWNjb3VudDogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfQUNDT1VOVCxcbiAgICAgICAgICAgICAgICByZWdpb246IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX1JFR0lPTlxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqIFN0ZXAgMi4gRUNTICovXG4gICAgICAgIGNvbnN0IGVjc0ZhcmdhdGVDbHVzdGVyID0gbmV3IEVjc0ZhcmdhdGVDbHVzdGVyU3RhY2sodGhpcywgYXBwbGljYXRpb25NZXRhRGF0YS5lY3NDbHVzdGVyU3RhY2tOYW1lLCB7XG4gICAgICAgICAgICB2cGM6IHZwYy52cGMsXG4gICAgICAgICAgICBzZWN1cml0eUdycDogdnBjLnNlY3VyaXR5R3JwLFxuICAgICAgICAgICAgYWxsb3dQb3J0OiBhcHBsaWNhdGlvbk1ldGFEYXRhLlRnckFsbG93UG9ydCxcbiAgICAgICAgICAgIGNsdXN0ZXJOYW1lOiBhcHBsaWNhdGlvbk1ldGFEYXRhLmNsdXN0ZXJOYW1lLFxuICAgICAgICB9KTtcblxuICAgICAgICAvKiogUmVhY3QgZnJvbnRlbmQgPj4gUHVibGljIFN1Ym5ldCAqKi9cbiAgICAgICAgY29uc3QgcmVhY3QgPSBuZXcgRWNzRmFyZ2F0ZVNlcnZpY2VTdGFjayh0aGlzLCBcIkZST05URU5EXCIgKyBhcHBsaWNhdGlvbk1ldGFEYXRhLkVDU1NlcnZpY2VTdGFja05hbWUsIHtcbiAgICAgICAgICAgIGFsYjogZWNzRmFyZ2F0ZUNsdXN0ZXIuYWxiLFxuICAgICAgICAgICAgbG9hZEJhbGFuY2VyTGlzdGVuZXI6IGVjc0ZhcmdhdGVDbHVzdGVyLmxvYWRCYWxhbmNlckxpc3RlbmVyLFxuICAgICAgICAgICAgY2x1c3RlcjogZWNzRmFyZ2F0ZUNsdXN0ZXIuY2x1c3RlcixcbiAgICAgICAgICAgIGNvZGVsb2NhdGlvbjogYXBwbGljYXRpb25NZXRhRGF0YS5yZWFjdENvZGVMb2NhdGlvbixcbiAgICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IGFwcGxpY2F0aW9uTWV0YURhdGEuY29udGFpbmVyUG9ydCxcbiAgICAgICAgICAgIGhvc3RQb3J0OiBhcHBsaWNhdGlvbk1ldGFEYXRhLlRnckFsbG93UG9ydCxcbiAgICAgICAgICAgIHByaW9yaXR5OiAxLFxuICAgICAgICAgICAgcGF0aFBhdHRlcm46IFwiLypcIixcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqIG5vZGVqcyA+PiBQcml2YXRlIFN1Ym5ldCAqKi9cbiAgICAgICAgY29uc3Qgbm9kZSA9IG5ldyBFY3NGYXJnYXRlU2VydmljZVN0YWNrKHRoaXMsIFwiQkFDS0VORFwiICsgYXBwbGljYXRpb25NZXRhRGF0YS5FQ1NTZXJ2aWNlU3RhY2tOYW1lLCB7XG4gICAgICAgICAgICBhbGI6IGVjc0ZhcmdhdGVDbHVzdGVyLmFsYixcbiAgICAgICAgICAgIGxvYWRCYWxhbmNlckxpc3RlbmVyOiBlY3NGYXJnYXRlQ2x1c3Rlci5sb2FkQmFsYW5jZXJMaXN0ZW5lcixcbiAgICAgICAgICAgIGNsdXN0ZXI6IGVjc0ZhcmdhdGVDbHVzdGVyLmNsdXN0ZXIsXG4gICAgICAgICAgICBjb2RlbG9jYXRpb246IGFwcGxpY2F0aW9uTWV0YURhdGEubm9kZUpzQ29kZUxvY2F0aW9uLFxuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogYXBwbGljYXRpb25NZXRhRGF0YS5jb250YWluZXJQb3J0LFxuICAgICAgICAgICAgaG9zdFBvcnQ6IGFwcGxpY2F0aW9uTWV0YURhdGEuVGdyQWxsb3dQb3J0LFxuICAgICAgICAgICAgc3VibmV0UHJpdmF0ZTogdHJ1ZSxcbiAgICAgICAgICAgIHByaW9yaXR5OiAyLFxuICAgICAgICAgICAgcGF0aFBhdHRlcm46IFwiL25vZGUvKlwiLFxuICAgICAgICB9KTtcblxuXG5cbiAgICB9XG59XG5cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBFY3NGYXJnYXRlQ29uc3RydWN0KGFwcCwgJ0Vjc0ZhcmdhdGVTdGFjazEnKTsiXX0=