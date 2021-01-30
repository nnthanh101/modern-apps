"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootStack = void 0;
const cdk = require("@aws-cdk/core");
const vpc_1 = require("../lib/vpc");
const config_1 = require("../configurations/config");
const ecs_fargate_cluster_stack_1 = require("../lib/ecs-fargate-cluster-stack");
const ecs_fargate_service_stack_1 = require("../lib/ecs-fargate-service-stack");
class RootStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /** Step 1. VPC */
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
exports.RootStack = RootStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vdC1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJvb3Qtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBRXJDLG9DQUFpQztBQUVqQyxxREFBK0Q7QUFFL0QsZ0ZBQTBFO0FBQzFFLGdGQUEwRTtBQUcxRSxNQUFhLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNwQyxZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsa0JBQWtCO1FBQ2xCLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLElBQUksRUFBRSw0QkFBbUIsQ0FBQyxZQUFZLEVBQUU7WUFDeEQsTUFBTSxFQUFFLDRCQUFtQixDQUFDLE1BQU07WUFDbEMsSUFBSSxFQUFFLDRCQUFtQixDQUFDLElBQUk7WUFDOUIsS0FBSyxFQUFFLDRCQUFtQixDQUFDLFVBQVU7WUFDckMsV0FBVyxFQUFFLENBQUM7WUFDZCxhQUFhLEVBQUUsNEJBQW1CLENBQUMsYUFBYTtZQUNoRCxLQUFLLEVBQUUsNEJBQW1CLENBQUMsS0FBSztZQUNoQyxXQUFXLEVBQUUsNEJBQW1CLENBQUMsV0FBVztZQUM1QyxHQUFHLEVBQUU7Z0JBQ0QsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CO2dCQUN4QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0I7YUFDekM7U0FDSixDQUFDLENBQUM7UUFFSCxrQkFBa0I7UUFDbEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGtEQUFzQixDQUFDLElBQUksRUFBRSw0QkFBbUIsQ0FBQyxtQkFBbUIsRUFBRTtZQUNoRyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUc7WUFDWixXQUFXLEVBQUUsR0FBRyxDQUFDLFdBQVc7WUFDNUIsU0FBUyxFQUFFLDRCQUFtQixDQUFDLFlBQVk7WUFDM0MsV0FBVyxFQUFFLDRCQUFtQixDQUFDLFdBQVc7U0FDL0MsQ0FBQyxDQUFDO1FBRUgsdUNBQXVDO1FBQ3ZDLE1BQU0sS0FBSyxHQUFHLElBQUksa0RBQXNCLENBQUMsSUFBSSxFQUFFLFVBQVUsR0FBRyw0QkFBbUIsQ0FBQyxtQkFBbUIsRUFBRTtZQUNqRyxHQUFHLEVBQUUsaUJBQWlCLENBQUMsR0FBRztZQUMxQixvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQyxvQkFBb0I7WUFDNUQsT0FBTyxFQUFFLGlCQUFpQixDQUFDLE9BQU87WUFDbEMsWUFBWSxFQUFFLDRCQUFtQixDQUFDLGlCQUFpQjtZQUNuRCxhQUFhLEVBQUUsNEJBQW1CLENBQUMsYUFBYTtZQUNoRCxRQUFRLEVBQUUsNEJBQW1CLENBQUMsWUFBWTtZQUMxQyxRQUFRLEVBQUUsQ0FBQztZQUNYLFdBQVcsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUVILGdDQUFnQztRQUNoQyxNQUFNLElBQUksR0FBRyxJQUFJLGtEQUFzQixDQUFDLElBQUksRUFBRSxTQUFTLEdBQUcsNEJBQW1CLENBQUMsbUJBQW1CLEVBQUU7WUFDL0YsR0FBRyxFQUFFLGlCQUFpQixDQUFDLEdBQUc7WUFDMUIsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUMsb0JBQW9CO1lBQzVELE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxPQUFPO1lBQ2xDLFlBQVksRUFBRSw0QkFBbUIsQ0FBQyxrQkFBa0I7WUFDcEQsYUFBYSxFQUFFLDRCQUFtQixDQUFDLGFBQWE7WUFDaEQsUUFBUSxFQUFFLDRCQUFtQixDQUFDLFlBQVk7WUFDMUMsYUFBYSxFQUFFLElBQUk7WUFDbkIsUUFBUSxFQUFFLENBQUM7WUFDWCxXQUFXLEVBQUUsU0FBUztTQUN6QixDQUFDLENBQUM7UUFFSCw4QkFBOEI7UUFDOUIscUhBQXFIO1FBQ3JILG9CQUFvQjtRQUNwQiwwQ0FBMEM7UUFDMUMsa0NBQWtDO1FBQ2xDLDRCQUE0QjtRQUM1Qix3QkFBd0I7UUFDeEIsTUFBTTtJQUVWLENBQUM7Q0FDSjtBQTlERCw4QkE4REMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5cbmltcG9ydCB7IFZwYyB9IGZyb20gXCIuLi9saWIvdnBjXCI7XG5cbmltcG9ydCB7IGFwcGxpY2F0aW9uTWV0YURhdGEgfSBmcm9tIFwiLi4vY29uZmlndXJhdGlvbnMvY29uZmlnXCI7XG5cbmltcG9ydCB7IEVjc0ZhcmdhdGVDbHVzdGVyU3RhY2sgfSBmcm9tIFwiLi4vbGliL2Vjcy1mYXJnYXRlLWNsdXN0ZXItc3RhY2tcIjtcbmltcG9ydCB7IEVjc0ZhcmdhdGVTZXJ2aWNlU3RhY2sgfSBmcm9tIFwiLi4vbGliL2Vjcy1mYXJnYXRlLXNlcnZpY2Utc3RhY2tcIjtcbmltcG9ydCB7IEZhcmdhdGVBdXRvc2NhbGVyU3RhY2sgfSBmcm9tIFwiLi4vbGliL2ZhcmdhdGUtYXV0b3NjYWxlclwiO1xuXG5leHBvcnQgY2xhc3MgUm9vdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgICAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgICAgICAvKiogU3RlcCAxLiBWUEMgKi9cbiAgICAgICAgY29uc3QgdnBjID0gbmV3IFZwYyh0aGlzLCBhcHBsaWNhdGlvbk1ldGFEYXRhLnZwY1N0YWNrTmFtZSwge1xuICAgICAgICAgICAgbWF4QXpzOiBhcHBsaWNhdGlvbk1ldGFEYXRhLm1heEF6cyxcbiAgICAgICAgICAgIGNpZHI6IGFwcGxpY2F0aW9uTWV0YURhdGEuY2lkcixcbiAgICAgICAgICAgIHBvcnRzOiBhcHBsaWNhdGlvbk1ldGFEYXRhLnB1YmxpY1BvcnQsXG4gICAgICAgICAgICBuYXRHYXRld2F5czogMSxcbiAgICAgICAgICAgIHVzZURlZmF1bHRWcGM6IGFwcGxpY2F0aW9uTWV0YURhdGEudXNlRGVmYXVsdFZwYyxcbiAgICAgICAgICAgIHZwY0lkOiBhcHBsaWNhdGlvbk1ldGFEYXRhLnZwY0lkLFxuICAgICAgICAgICAgdXNlRXhpc3RWcGM6IGFwcGxpY2F0aW9uTWV0YURhdGEudXNlRXhpc3RWcGMsXG4gICAgICAgICAgICBlbnY6IHtcbiAgICAgICAgICAgICAgICBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5ULFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OXG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICAvKiogU3RlcCAyLiBFQ1MgKi9cbiAgICAgICAgY29uc3QgZWNzRmFyZ2F0ZUNsdXN0ZXIgPSBuZXcgRWNzRmFyZ2F0ZUNsdXN0ZXJTdGFjayh0aGlzLCBhcHBsaWNhdGlvbk1ldGFEYXRhLmVjc0NsdXN0ZXJTdGFja05hbWUsIHtcbiAgICAgICAgICAgIHZwYzogdnBjLnZwYyxcbiAgICAgICAgICAgIHNlY3VyaXR5R3JwOiB2cGMuc2VjdXJpdHlHcnAsXG4gICAgICAgICAgICBhbGxvd1BvcnQ6IGFwcGxpY2F0aW9uTWV0YURhdGEuVGdyQWxsb3dQb3J0LFxuICAgICAgICAgICAgY2x1c3Rlck5hbWU6IGFwcGxpY2F0aW9uTWV0YURhdGEuY2x1c3Rlck5hbWUsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKiBSZWFjdCBmcm9udGVuZCA+PiBQdWJsaWMgU3VibmV0ICoqL1xuICAgICAgICBjb25zdCByZWFjdCA9IG5ldyBFY3NGYXJnYXRlU2VydmljZVN0YWNrKHRoaXMsIFwiRlJPTlRFTkRcIiArIGFwcGxpY2F0aW9uTWV0YURhdGEuRUNTU2VydmljZVN0YWNrTmFtZSwge1xuICAgICAgICAgICAgYWxiOiBlY3NGYXJnYXRlQ2x1c3Rlci5hbGIsXG4gICAgICAgICAgICBsb2FkQmFsYW5jZXJMaXN0ZW5lcjogZWNzRmFyZ2F0ZUNsdXN0ZXIubG9hZEJhbGFuY2VyTGlzdGVuZXIsXG4gICAgICAgICAgICBjbHVzdGVyOiBlY3NGYXJnYXRlQ2x1c3Rlci5jbHVzdGVyLFxuICAgICAgICAgICAgY29kZWxvY2F0aW9uOiBhcHBsaWNhdGlvbk1ldGFEYXRhLnJlYWN0Q29kZUxvY2F0aW9uLFxuICAgICAgICAgICAgY29udGFpbmVyUG9ydDogYXBwbGljYXRpb25NZXRhRGF0YS5jb250YWluZXJQb3J0LFxuICAgICAgICAgICAgaG9zdFBvcnQ6IGFwcGxpY2F0aW9uTWV0YURhdGEuVGdyQWxsb3dQb3J0LFxuICAgICAgICAgICAgcHJpb3JpdHk6IDEsXG4gICAgICAgICAgICBwYXRoUGF0dGVybjogXCIvKlwiLFxuICAgICAgICB9KTtcblxuICAgICAgICAvKiogbm9kZWpzID4+IFByaXZhdGUgU3VibmV0ICoqL1xuICAgICAgICBjb25zdCBub2RlID0gbmV3IEVjc0ZhcmdhdGVTZXJ2aWNlU3RhY2sodGhpcywgXCJCQUNLRU5EXCIgKyBhcHBsaWNhdGlvbk1ldGFEYXRhLkVDU1NlcnZpY2VTdGFja05hbWUsIHtcbiAgICAgICAgICAgIGFsYjogZWNzRmFyZ2F0ZUNsdXN0ZXIuYWxiLFxuICAgICAgICAgICAgbG9hZEJhbGFuY2VyTGlzdGVuZXI6IGVjc0ZhcmdhdGVDbHVzdGVyLmxvYWRCYWxhbmNlckxpc3RlbmVyLFxuICAgICAgICAgICAgY2x1c3RlcjogZWNzRmFyZ2F0ZUNsdXN0ZXIuY2x1c3RlcixcbiAgICAgICAgICAgIGNvZGVsb2NhdGlvbjogYXBwbGljYXRpb25NZXRhRGF0YS5ub2RlSnNDb2RlTG9jYXRpb24sXG4gICAgICAgICAgICBjb250YWluZXJQb3J0OiBhcHBsaWNhdGlvbk1ldGFEYXRhLmNvbnRhaW5lclBvcnQsXG4gICAgICAgICAgICBob3N0UG9ydDogYXBwbGljYXRpb25NZXRhRGF0YS5UZ3JBbGxvd1BvcnQsXG4gICAgICAgICAgICBzdWJuZXRQcml2YXRlOiB0cnVlLFxuICAgICAgICAgICAgcHJpb3JpdHk6IDIsXG4gICAgICAgICAgICBwYXRoUGF0dGVybjogXCIvbm9kZS8qXCIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qKiBTdGVwIDMuIFJlYWN0IEFwcCBzY2FsZSoqL1xuICAgICAgICAvLyBjb25zdCBmYXJnYXRlQXV0b3NjYWxlclN0YWNrID0gbmV3IEZhcmdhdGVBdXRvc2NhbGVyU3RhY2sodGhpcywgYXBwbGljYXRpb25NZXRhRGF0YS5GYXJnYXRlQXV0b3NjYWxlclN0YWNrTmFtZSAsIHtcbiAgICAgICAgLy8gICAgIHZwYzogdnBjLnZwYyxcbiAgICAgICAgLy8gICAgIGNsdXN0ZXI6IGVjc0ZhcmdhdGVDbHVzdGVyLmNsdXN0ZXIsXG4gICAgICAgIC8vICAgICBmZ1NlcnZpY2U6IHJlYWN0LmZnc2VydmljZSxcbiAgICAgICAgLy8gICAgIGRpc2FibGVTY2FsZUluOiB0cnVlLFxuICAgICAgICAvLyAgICAgc2NhbGVUeXBlOiAnUmFtJyxcbiAgICAgICAgLy8gfSk7XG5cbiAgICB9XG59XG4iXX0=