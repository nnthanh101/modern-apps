"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsFargateServiceStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const aws_ecs_2 = require("@aws-cdk/aws-ecs");
const aws_iam_1 = require("@aws-cdk/aws-iam");
/**
 * ECS-Fargate Service Stack
 */
// export class EcsFargateServiceStack extends FargateService {
class EcsFargateServiceStack extends cdk.Construct {
    constructor(parent, id, props) {
        var _a, _b;
        super(parent, id);
        /**
         * 1.ECS Task
         **/
        const taskRole = new aws_iam_1.Role(parent, id + "-Role", {
            assumedBy: new aws_iam_1.ServicePrincipal("ecs-tasks.amazonaws.com"),
            description: "Adds managed policies to ecs role for ecr image pulls and execution",
            roleName: (_a = props.roleNameFargate) !== null && _a !== void 0 ? _a : id + "-Role",
        });
        const ecsPolicy = new aws_iam_1.Policy(parent, id + "-Policy", {
            policyName: (_b = props.policyNameFargate) !== null && _b !== void 0 ? _b : id + "-Policy",
            statements: [
                new aws_iam_1.PolicyStatement({
                    effect: aws_iam_1.Effect.ALLOW,
                    actions: [
                        "ecr:GetAuthorizationToken",
                        "ecr:BatchCheckLayerAvailability",
                        "ecr:GetDownloadUrlForLayer",
                        "ecr:BatchGetImage",
                        "logs:CreateLogStream",
                        "logs:CreateLogGroup",
                        "logs:PutLogEvents",
                    ],
                    resources: ["*"],
                }),
            ],
        });
        taskRole.attachInlinePolicy(ecsPolicy);
        taskRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2ContainerRegistryPowerUser"));
        taskRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName("AmazonECS_FullAccess"));
        taskRole.addManagedPolicy(aws_iam_1.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsFullAccess"));
        /**
         * 5. ECS Task
         */
        /** 5.1. Create ECS Task definition */
        const taskDef = new aws_ecs_2.FargateTaskDefinition(parent, id + "-FargateTaskDef", {
            memoryLimitMiB: props.memoryLimitMiB,
            cpu: props.cpu,
            executionRole: taskRole,
        });
        /** 5.2. Add Container Docker-Image */
        const appContainer = new aws_ecs_2.ContainerDefinition(parent, id + "-ContainerDef", {
            image: aws_ecs_2.ContainerImage.fromAsset(props.codelocation),
            taskDefinition: taskDef,
            logging: new aws_ecs_1.AwsLogDriver({
                streamPrefix: id,
            }),
        });
        /** 5.3. Port mapping */
        appContainer.addPortMappings({
            // hostPort: props.hostPort,
            containerPort: props.containerPort,
            protocol: aws_ecs_2.Protocol.TCP,
        });
        /** 6. Create Fargate Service */
        this.fgservice = new aws_ecs_2.FargateService(parent, id + "-FargateService", {
            cluster: props.cluster,
            taskDefinition: taskDef,
            desiredCount: props.desiredCount,
            maxHealthyPercent: props.maxHealthyPercent,
            minHealthyPercent: props.minHealthyPercent,
            // securityGroup: props.securityGrp,
            assignPublicIp: true,
            vpcSubnets: {
                subnetType: props.subnetPrivate ? aws_ec2_1.SubnetType.PRIVATE : aws_ec2_1.SubnetType.PUBLIC
            }
        });
        /**
         * FIXME Connect service to TargetGroup
         * NOTE: This does not introduce a cycle because ECS Services are self-registering.
         * (they point to the TargetGroup instead of the other way around).
         */
        // props.targetGroup.addTarget(this.fgservice);
        props.loadBalancerListener.addTargets(id + "-TargetGroup", {
            port: props.hostPort,
            targets: [this.fgservice],
            priority: props.priority,
            pathPattern: props.pathPattern,
        });
    }
}
exports.EcsFargateServiceStack = EcsFargateServiceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWZhcmdhdGUtc2VydmljZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjcy1mYXJnYXRlLXNlcnZpY2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLDhDQUFnRDtBQUNoRCw4Q0FBZ0Q7QUFDaEQsOENBQWlJO0FBQ2pJLDhDQUF5RztBQTZCekc7O0dBRUc7QUFDSCwrREFBK0Q7QUFDL0QsTUFBYSxzQkFBdUIsU0FBUSxHQUFHLENBQUMsU0FBUztJQUV2RCxZQUFZLE1BQXFCLEVBQUUsRUFBVSxFQUFFLEtBQWtDOztRQUMvRSxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWxCOztZQUVJO1FBQ0osTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxPQUFPLEVBQUU7WUFDOUMsU0FBUyxFQUFFLElBQUksMEJBQWdCLENBQUMseUJBQXlCLENBQUM7WUFDMUQsV0FBVyxFQUFFLHFFQUFxRTtZQUNsRixRQUFRLFFBQUUsS0FBSyxDQUFDLGVBQWUsbUNBQUksRUFBRSxHQUFHLE9BQU87U0FDaEQsQ0FBQyxDQUFDO1FBR0gsTUFBTSxTQUFTLEdBQVcsSUFBSSxnQkFBTSxDQUFDLE1BQU0sRUFBQyxFQUFFLEdBQUUsU0FBUyxFQUFFO1lBQ3pELFVBQVUsUUFBRSxLQUFLLENBQUMsaUJBQWlCLG1DQUFJLEVBQUUsR0FBRyxTQUFTO1lBQ3JELFVBQVUsRUFBRTtnQkFDVixJQUFJLHlCQUFlLENBQUM7b0JBQ2xCLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7b0JBQ3BCLE9BQU8sRUFBRTt3QkFDUCwyQkFBMkI7d0JBQzNCLGlDQUFpQzt3QkFDakMsNEJBQTRCO3dCQUM1QixtQkFBbUI7d0JBQ25CLHNCQUFzQjt3QkFDdEIscUJBQXFCO3dCQUNyQixtQkFBbUI7cUJBQ3BCO29CQUNELFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztpQkFDakIsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDdkIsdUJBQWEsQ0FBQyx3QkFBd0IsQ0FDcEMscUNBQXFDLENBQ3RDLENBQ0YsQ0FBQztRQUNGLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDdkIsdUJBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUMvRCxDQUFDO1FBQ0YsUUFBUSxDQUFDLGdCQUFnQixDQUN2Qix1QkFBYSxDQUFDLHdCQUF3QixDQUFDLDBCQUEwQixDQUFDLENBQ25FLENBQUM7UUFFRjs7V0FFRztRQUVILHNDQUFzQztRQUN0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLCtCQUFxQixDQUN2QyxNQUFNLEVBQ04sRUFBRSxHQUFHLGlCQUFpQixFQUN0QjtZQUNFLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxhQUFhLEVBQUUsUUFBUTtTQUN4QixDQUNGLENBQUM7UUFFRixzQ0FBc0M7UUFDdEMsTUFBTSxZQUFZLEdBQUcsSUFBSSw2QkFBbUIsQ0FDMUMsTUFBTSxFQUNOLEVBQUUsR0FBRyxlQUFlLEVBQ3BCO1lBQ0UsS0FBSyxFQUFFLHdCQUFjLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7WUFDbkQsY0FBYyxFQUFFLE9BQU87WUFDdkIsT0FBTyxFQUFFLElBQUksc0JBQVksQ0FBQztnQkFDeEIsWUFBWSxFQUFFLEVBQUU7YUFDakIsQ0FBQztTQUNILENBQ0YsQ0FBQztRQUVGLHdCQUF3QjtRQUN4QixZQUFZLENBQUMsZUFBZSxDQUFDO1lBQzNCLDRCQUE0QjtZQUM1QixhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7WUFDbEMsUUFBUSxFQUFFLGtCQUFRLENBQUMsR0FBRztTQUN2QixDQUFDLENBQUM7UUFFSCxnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHdCQUFjLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxpQkFBaUIsRUFBRTtZQUNsRSxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87WUFDdEIsY0FBYyxFQUFFLE9BQU87WUFDdkIsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1lBQ2hDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7WUFDMUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtZQUMxQyxvQ0FBb0M7WUFDcEMsY0FBYyxFQUFFLElBQUk7WUFDcEIsVUFBVSxFQUFFO2dCQUNWLFVBQVUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxvQkFBVSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUMsb0JBQVUsQ0FBQyxNQUFNO2FBQ3hFO1NBQ0YsQ0FBQyxDQUFDO1FBRUg7Ozs7V0FJRztRQUNILCtDQUErQztRQUUvQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxjQUFjLEVBQUU7WUFDekQsSUFBSSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3BCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDekIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztTQUMvQixDQUFDLENBQUM7SUFFTCxDQUFDO0NBQ0Y7QUEvR0Qsd0RBK0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7IFxuaW1wb3J0IHsgICBTdWJuZXRUeXBlIH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1lYzJcIjtcbmltcG9ydCB7IEF3c0xvZ0RyaXZlciB9IGZyb20gXCJAYXdzLWNkay9hd3MtZWNzXCI7XG5pbXBvcnQgeyBDbHVzdGVyLCBGYXJnYXRlU2VydmljZSwgIEZhcmdhdGVUYXNrRGVmaW5pdGlvbiwgQ29udGFpbmVyRGVmaW5pdGlvbiwgQ29udGFpbmVySW1hZ2UsIFByb3RvY29sfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWVjc1wiO1xuaW1wb3J0IHsgU2VydmljZVByaW5jaXBhbCwgUm9sZSwgUG9saWN5LCBQb2xpY3lTdGF0ZW1lbnQsIEVmZmVjdCwgTWFuYWdlZFBvbGljeX0gZnJvbSBcIkBhd3MtY2RrL2F3cy1pYW1cIjtcbmltcG9ydCB7ICBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlciwgQXBwbGljYXRpb25MaXN0ZW5lcn0gZnJvbSBcIkBhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWNzRmFyZ2F0ZVNlcnZpY2VTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICByZWFkb25seSBjbHVzdGVyOiBDbHVzdGVyO1xuICByZWFkb25seSBhbGI6IEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyO1xuICByZWFkb25seSBsb2FkQmFsYW5jZXJMaXN0ZW5lcjogQXBwbGljYXRpb25MaXN0ZW5lcjtcbiAgLy8gRklYTUVcbiAgLy8gdGFyZ2V0R3JvdXA6IEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXA7XG4gIFxuICByZWFkb25seSBjb2RlbG9jYXRpb246IHN0cmluZztcbiAgcmVhZG9ubHkgY29udGFpbmVyUG9ydDogbnVtYmVyO1xuICByZWFkb25seSBob3N0UG9ydDogbnVtYmVyO1xuXG4gIHJlYWRvbmx5IHJvbGVOYW1lRmFyZ2F0ZT86IHN0cmluZztcbiAgcmVhZG9ubHkgcG9saWN5TmFtZUZhcmdhdGU/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IG1lbW9yeUxpbWl0TWlCPzogbnVtYmVyO1xuICByZWFkb25seSBjcHU/OiBudW1iZXI7XG4gIHJlYWRvbmx5IGRlc2lyZWRDb3VudD86IG51bWJlcjtcbiAgcmVhZG9ubHkgbWF4SGVhbHRoeVBlcmNlbnQ/OiBudW1iZXI7XG4gIHJlYWRvbmx5IG1pbkhlYWx0aHlQZXJjZW50PzogbnVtYmVyO1xuICByZWFkb25seSBwcmlvcml0eTogbnVtYmVyO1xuICByZWFkb25seSBwYXRoUGF0dGVybjogc3RyaW5nO1xuICByZWFkb25seSBzdWJuZXRQcml2YXRlPzogYm9vbGVhbjtcbiAgcmVhZG9ubHkgdGFncz86IHtcbiAgICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XG4gIH07XG59XG4gXG4vKipcbiAqIEVDUy1GYXJnYXRlIFNlcnZpY2UgU3RhY2tcbiAqL1xuLy8gZXhwb3J0IGNsYXNzIEVjc0ZhcmdhdGVTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBGYXJnYXRlU2VydmljZSB7XG5leHBvcnQgY2xhc3MgRWNzRmFyZ2F0ZVNlcnZpY2VTdGFjayBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xuICByZWFkb25seSBmZ3NlcnZpY2U6IEZhcmdhdGVTZXJ2aWNlO1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFY3NGYXJnYXRlU2VydmljZVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihwYXJlbnQsIGlkKTtcbiAgICBcbiAgICAvKipcbiAgICAgKiAxLkVDUyBUYXNrXG4gICAgICoqL1xuICAgIGNvbnN0IHRhc2tSb2xlID0gbmV3IFJvbGUocGFyZW50LCBpZCArIFwiLVJvbGVcIiwge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbChcImVjcy10YXNrcy5hbWF6b25hd3MuY29tXCIpLFxuICAgICAgZGVzY3JpcHRpb246IFwiQWRkcyBtYW5hZ2VkIHBvbGljaWVzIHRvIGVjcyByb2xlIGZvciBlY3IgaW1hZ2UgcHVsbHMgYW5kIGV4ZWN1dGlvblwiLFxuICAgICAgcm9sZU5hbWU6IHByb3BzLnJvbGVOYW1lRmFyZ2F0ZSA/PyBpZCArIFwiLVJvbGVcIixcbiAgICB9KTtcbiAgICBcbiBcbiAgICBjb25zdCBlY3NQb2xpY3k6IFBvbGljeSA9IG5ldyBQb2xpY3kocGFyZW50LGlkKyBcIi1Qb2xpY3lcIiwge1xuICAgICAgcG9saWN5TmFtZTogcHJvcHMucG9saWN5TmFtZUZhcmdhdGUgPz8gaWQgKyBcIi1Qb2xpY3lcIixcbiAgICAgIHN0YXRlbWVudHM6IFtcbiAgICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgXCJlY3I6R2V0QXV0aG9yaXphdGlvblRva2VuXCIsXG4gICAgICAgICAgICBcImVjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHlcIixcbiAgICAgICAgICAgIFwiZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXJcIixcbiAgICAgICAgICAgIFwiZWNyOkJhdGNoR2V0SW1hZ2VcIixcbiAgICAgICAgICAgIFwibG9nczpDcmVhdGVMb2dTdHJlYW1cIixcbiAgICAgICAgICAgIFwibG9nczpDcmVhdGVMb2dHcm91cFwiLFxuICAgICAgICAgICAgXCJsb2dzOlB1dExvZ0V2ZW50c1wiLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbXCIqXCJdLCBcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGFza1JvbGUuYXR0YWNoSW5saW5lUG9saWN5KGVjc1BvbGljeSk7XG4gICAgdGFza1JvbGUuYWRkTWFuYWdlZFBvbGljeShcbiAgICAgIE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKFxuICAgICAgICBcIkFtYXpvbkVDMkNvbnRhaW5lclJlZ2lzdHJ5UG93ZXJVc2VyXCJcbiAgICAgIClcbiAgICApO1xuICAgIHRhc2tSb2xlLmFkZE1hbmFnZWRQb2xpY3koXG4gICAgICBNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZShcIkFtYXpvbkVDU19GdWxsQWNjZXNzXCIpXG4gICAgKTtcbiAgICB0YXNrUm9sZS5hZGRNYW5hZ2VkUG9saWN5KFxuICAgICAgTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoXCJDbG91ZFdhdGNoTG9nc0Z1bGxBY2Nlc3NcIilcbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogNS4gRUNTIFRhc2tcbiAgICAgKi9cblxuICAgIC8qKiA1LjEuIENyZWF0ZSBFQ1MgVGFzayBkZWZpbml0aW9uICovXG4gICAgY29uc3QgdGFza0RlZiA9IG5ldyBGYXJnYXRlVGFza0RlZmluaXRpb24oXG4gICAgICBwYXJlbnQsXG4gICAgICBpZCArIFwiLUZhcmdhdGVUYXNrRGVmXCIsXG4gICAgICB7XG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiBwcm9wcy5tZW1vcnlMaW1pdE1pQiAsXG4gICAgICAgIGNwdTogcHJvcHMuY3B1ICxcbiAgICAgICAgZXhlY3V0aW9uUm9sZTogdGFza1JvbGUsXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8qKiA1LjIuIEFkZCBDb250YWluZXIgRG9ja2VyLUltYWdlICovXG4gICAgY29uc3QgYXBwQ29udGFpbmVyID0gbmV3IENvbnRhaW5lckRlZmluaXRpb24oXG4gICAgICBwYXJlbnQsXG4gICAgICBpZCArIFwiLUNvbnRhaW5lckRlZlwiLFxuICAgICAgeyBcbiAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21Bc3NldChwcm9wcy5jb2RlbG9jYXRpb24pLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbjogdGFza0RlZixcbiAgICAgICAgbG9nZ2luZzogbmV3IEF3c0xvZ0RyaXZlcih7XG4gICAgICAgICAgc3RyZWFtUHJlZml4OiBpZCxcbiAgICAgICAgfSksXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8qKiA1LjMuIFBvcnQgbWFwcGluZyAqL1xuICAgIGFwcENvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3Moe1xuICAgICAgLy8gaG9zdFBvcnQ6IHByb3BzLmhvc3RQb3J0LFxuICAgICAgY29udGFpbmVyUG9ydDogcHJvcHMuY29udGFpbmVyUG9ydCxcbiAgICAgIHByb3RvY29sOiBQcm90b2NvbC5UQ1AsXG4gICAgfSk7XG5cbiAgICAvKiogNi4gQ3JlYXRlIEZhcmdhdGUgU2VydmljZSAqL1xuICAgIHRoaXMuZmdzZXJ2aWNlID0gbmV3IEZhcmdhdGVTZXJ2aWNlKHBhcmVudCwgaWQgKyBcIi1GYXJnYXRlU2VydmljZVwiLCB7XG4gICAgICBjbHVzdGVyOiBwcm9wcy5jbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWYsXG4gICAgICBkZXNpcmVkQ291bnQ6IHByb3BzLmRlc2lyZWRDb3VudCAsXG4gICAgICBtYXhIZWFsdGh5UGVyY2VudDogcHJvcHMubWF4SGVhbHRoeVBlcmNlbnQgLFxuICAgICAgbWluSGVhbHRoeVBlcmNlbnQ6IHByb3BzLm1pbkhlYWx0aHlQZXJjZW50ICxcbiAgICAgIC8vIHNlY3VyaXR5R3JvdXA6IHByb3BzLnNlY3VyaXR5R3JwLFxuICAgICAgYXNzaWduUHVibGljSXA6IHRydWUsXG4gICAgICB2cGNTdWJuZXRzOiB7IFxuICAgICAgICBzdWJuZXRUeXBlOiBwcm9wcy5zdWJuZXRQcml2YXRlID8gU3VibmV0VHlwZS5QUklWQVRFOiBTdWJuZXRUeXBlLlBVQkxJQ1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogRklYTUUgQ29ubmVjdCBzZXJ2aWNlIHRvIFRhcmdldEdyb3VwXG4gICAgICogTk9URTogVGhpcyBkb2VzIG5vdCBpbnRyb2R1Y2UgYSBjeWNsZSBiZWNhdXNlIEVDUyBTZXJ2aWNlcyBhcmUgc2VsZi1yZWdpc3RlcmluZy5cbiAgICAgKiAodGhleSBwb2ludCB0byB0aGUgVGFyZ2V0R3JvdXAgaW5zdGVhZCBvZiB0aGUgb3RoZXIgd2F5IGFyb3VuZCkuXG4gICAgICovIFxuICAgIC8vIHByb3BzLnRhcmdldEdyb3VwLmFkZFRhcmdldCh0aGlzLmZnc2VydmljZSk7XG5cbiAgICBwcm9wcy5sb2FkQmFsYW5jZXJMaXN0ZW5lci5hZGRUYXJnZXRzKGlkICsgXCItVGFyZ2V0R3JvdXBcIiwge1xuICAgICAgcG9ydDogcHJvcHMuaG9zdFBvcnQsXG4gICAgICB0YXJnZXRzOiBbdGhpcy5mZ3NlcnZpY2VdLFxuICAgICAgcHJpb3JpdHk6IHByb3BzLnByaW9yaXR5LFxuICAgICAgcGF0aFBhdHRlcm46IHByb3BzLnBhdGhQYXR0ZXJuLFxuICAgIH0pO1xuXG4gIH1cbn0iXX0=