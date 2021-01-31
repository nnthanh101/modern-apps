"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsFargateServiceConstruct = void 0;
const cdk = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const aws_ecs_2 = require("@aws-cdk/aws-ecs");
const aws_iam_1 = require("@aws-cdk/aws-iam");
/**
 * ECS-Fargate Service Stack
 */
// export class EcsFargateServiceStack extends FargateService {
class EcsFargateServiceConstruct extends cdk.Construct {
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
exports.EcsFargateServiceConstruct = EcsFargateServiceConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWZhcmdhdGUtc2VydmljZS1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlY3MtZmFyZ2F0ZS1zZXJ2aWNlLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsOENBQWdEO0FBQ2hELDhDQUFnRDtBQUNoRCw4Q0FBaUk7QUFDakksOENBQXlHO0FBNkJ6Rzs7R0FFRztBQUNILCtEQUErRDtBQUMvRCxNQUFhLDBCQUEyQixTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBRTNELFlBQVksTUFBcUIsRUFBRSxFQUFVLEVBQUUsS0FBa0M7O1FBQy9FLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbEI7O1lBRUk7UUFDSixNQUFNLFFBQVEsR0FBRyxJQUFJLGNBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLE9BQU8sRUFBRTtZQUM5QyxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQztZQUMxRCxXQUFXLEVBQUUscUVBQXFFO1lBQ2xGLFFBQVEsUUFBRSxLQUFLLENBQUMsZUFBZSxtQ0FBSSxFQUFFLEdBQUcsT0FBTztTQUNoRCxDQUFDLENBQUM7UUFHSCxNQUFNLFNBQVMsR0FBVyxJQUFJLGdCQUFNLENBQUMsTUFBTSxFQUFDLEVBQUUsR0FBRSxTQUFTLEVBQUU7WUFDekQsVUFBVSxRQUFFLEtBQUssQ0FBQyxpQkFBaUIsbUNBQUksRUFBRSxHQUFHLFNBQVM7WUFDckQsVUFBVSxFQUFFO2dCQUNWLElBQUkseUJBQWUsQ0FBQztvQkFDbEIsTUFBTSxFQUFFLGdCQUFNLENBQUMsS0FBSztvQkFDcEIsT0FBTyxFQUFFO3dCQUNQLDJCQUEyQjt3QkFDM0IsaUNBQWlDO3dCQUNqQyw0QkFBNEI7d0JBQzVCLG1CQUFtQjt3QkFDbkIsc0JBQXNCO3dCQUN0QixxQkFBcUI7d0JBQ3JCLG1CQUFtQjtxQkFDcEI7b0JBQ0QsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO2lCQUNqQixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsa0JBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDdkMsUUFBUSxDQUFDLGdCQUFnQixDQUN2Qix1QkFBYSxDQUFDLHdCQUF3QixDQUNwQyxxQ0FBcUMsQ0FDdEMsQ0FDRixDQUFDO1FBQ0YsUUFBUSxDQUFDLGdCQUFnQixDQUN2Qix1QkFBYSxDQUFDLHdCQUF3QixDQUFDLHNCQUFzQixDQUFDLENBQy9ELENBQUM7UUFDRixRQUFRLENBQUMsZ0JBQWdCLENBQ3ZCLHVCQUFhLENBQUMsd0JBQXdCLENBQUMsMEJBQTBCLENBQUMsQ0FDbkUsQ0FBQztRQUVGOztXQUVHO1FBRUgsc0NBQXNDO1FBQ3RDLE1BQU0sT0FBTyxHQUFHLElBQUksK0JBQXFCLENBQ3ZDLE1BQU0sRUFDTixFQUFFLEdBQUcsaUJBQWlCLEVBQ3RCO1lBQ0UsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO1lBQ3BDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLGFBQWEsRUFBRSxRQUFRO1NBQ3hCLENBQ0YsQ0FBQztRQUVGLHNDQUFzQztRQUN0QyxNQUFNLFlBQVksR0FBRyxJQUFJLDZCQUFtQixDQUMxQyxNQUFNLEVBQ04sRUFBRSxHQUFHLGVBQWUsRUFDcEI7WUFDRSxLQUFLLEVBQUUsd0JBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztZQUNuRCxjQUFjLEVBQUUsT0FBTztZQUN2QixPQUFPLEVBQUUsSUFBSSxzQkFBWSxDQUFDO2dCQUN4QixZQUFZLEVBQUUsRUFBRTthQUNqQixDQUFDO1NBQ0gsQ0FDRixDQUFDO1FBRUYsd0JBQXdCO1FBQ3hCLFlBQVksQ0FBQyxlQUFlLENBQUM7WUFDM0IsNEJBQTRCO1lBQzVCLGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtZQUNsQyxRQUFRLEVBQUUsa0JBQVEsQ0FBQyxHQUFHO1NBQ3ZCLENBQUMsQ0FBQztRQUVILGdDQUFnQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksd0JBQWMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLGlCQUFpQixFQUFFO1lBQ2xFLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixjQUFjLEVBQUUsT0FBTztZQUN2QixZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDaEMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtZQUMxQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsaUJBQWlCO1lBQzFDLG9DQUFvQztZQUNwQyxjQUFjLEVBQUUsSUFBSTtZQUNwQixVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLG9CQUFVLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQyxvQkFBVSxDQUFDLE1BQU07YUFDeEU7U0FDRixDQUFDLENBQUM7UUFFSDs7OztXQUlHO1FBQ0gsK0NBQStDO1FBRS9DLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsRUFBRSxHQUFHLGNBQWMsRUFBRTtZQUN6RCxJQUFJLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDcEIsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUN6QixRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDeEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXO1NBQy9CLENBQUMsQ0FBQztJQUVMLENBQUM7Q0FDRjtBQS9HRCxnRUErR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjsgXG5pbXBvcnQgeyAgIFN1Ym5ldFR5cGUgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWVjMlwiO1xuaW1wb3J0IHsgQXdzTG9nRHJpdmVyIH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1lY3NcIjtcbmltcG9ydCB7IENsdXN0ZXIsIEZhcmdhdGVTZXJ2aWNlLCAgRmFyZ2F0ZVRhc2tEZWZpbml0aW9uLCBDb250YWluZXJEZWZpbml0aW9uLCBDb250YWluZXJJbWFnZSwgUHJvdG9jb2x9IGZyb20gXCJAYXdzLWNkay9hd3MtZWNzXCI7XG5pbXBvcnQgeyBTZXJ2aWNlUHJpbmNpcGFsLCBSb2xlLCBQb2xpY3ksIFBvbGljeVN0YXRlbWVudCwgRWZmZWN0LCBNYW5hZ2VkUG9saWN5fSBmcm9tIFwiQGF3cy1jZGsvYXdzLWlhbVwiO1xuaW1wb3J0IHsgIEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyLCBBcHBsaWNhdGlvbkxpc3RlbmVyfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBFY3NGYXJnYXRlU2VydmljZVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHJlYWRvbmx5IGNsdXN0ZXI6IENsdXN0ZXI7XG4gIHJlYWRvbmx5IGFsYjogQXBwbGljYXRpb25Mb2FkQmFsYW5jZXI7XG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlckxpc3RlbmVyOiBBcHBsaWNhdGlvbkxpc3RlbmVyO1xuICAvLyBGSVhNRVxuICAvLyB0YXJnZXRHcm91cDogQXBwbGljYXRpb25UYXJnZXRHcm91cDtcbiAgXG4gIHJlYWRvbmx5IGNvZGVsb2NhdGlvbjogc3RyaW5nO1xuICByZWFkb25seSBjb250YWluZXJQb3J0OiBudW1iZXI7XG4gIHJlYWRvbmx5IGhvc3RQb3J0OiBudW1iZXI7XG5cbiAgcmVhZG9ubHkgcm9sZU5hbWVGYXJnYXRlPzogc3RyaW5nO1xuICByZWFkb25seSBwb2xpY3lOYW1lRmFyZ2F0ZT86IHN0cmluZztcbiAgcmVhZG9ubHkgbWVtb3J5TGltaXRNaUI/OiBudW1iZXI7XG4gIHJlYWRvbmx5IGNwdT86IG51bWJlcjtcbiAgcmVhZG9ubHkgZGVzaXJlZENvdW50PzogbnVtYmVyO1xuICByZWFkb25seSBtYXhIZWFsdGh5UGVyY2VudD86IG51bWJlcjtcbiAgcmVhZG9ubHkgbWluSGVhbHRoeVBlcmNlbnQ/OiBudW1iZXI7XG4gIHJlYWRvbmx5IHByaW9yaXR5OiBudW1iZXI7XG4gIHJlYWRvbmx5IHBhdGhQYXR0ZXJuOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHN1Ym5ldFByaXZhdGU/OiBib29sZWFuO1xuICByZWFkb25seSB0YWdzPzoge1xuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZztcbiAgfTtcbn1cbiBcbi8qKlxuICogRUNTLUZhcmdhdGUgU2VydmljZSBTdGFja1xuICovXG4vLyBleHBvcnQgY2xhc3MgRWNzRmFyZ2F0ZVNlcnZpY2VTdGFjayBleHRlbmRzIEZhcmdhdGVTZXJ2aWNlIHtcbmV4cG9ydCBjbGFzcyBFY3NGYXJnYXRlU2VydmljZUNvbnN0cnVjdCBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xuICByZWFkb25seSBmZ3NlcnZpY2U6IEZhcmdhdGVTZXJ2aWNlO1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFY3NGYXJnYXRlU2VydmljZVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihwYXJlbnQsIGlkKTtcbiAgICBcbiAgICAvKipcbiAgICAgKiAxLkVDUyBUYXNrXG4gICAgICoqL1xuICAgIGNvbnN0IHRhc2tSb2xlID0gbmV3IFJvbGUocGFyZW50LCBpZCArIFwiLVJvbGVcIiwge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbChcImVjcy10YXNrcy5hbWF6b25hd3MuY29tXCIpLFxuICAgICAgZGVzY3JpcHRpb246IFwiQWRkcyBtYW5hZ2VkIHBvbGljaWVzIHRvIGVjcyByb2xlIGZvciBlY3IgaW1hZ2UgcHVsbHMgYW5kIGV4ZWN1dGlvblwiLFxuICAgICAgcm9sZU5hbWU6IHByb3BzLnJvbGVOYW1lRmFyZ2F0ZSA/PyBpZCArIFwiLVJvbGVcIixcbiAgICB9KTtcbiAgICBcbiBcbiAgICBjb25zdCBlY3NQb2xpY3k6IFBvbGljeSA9IG5ldyBQb2xpY3kocGFyZW50LGlkKyBcIi1Qb2xpY3lcIiwge1xuICAgICAgcG9saWN5TmFtZTogcHJvcHMucG9saWN5TmFtZUZhcmdhdGUgPz8gaWQgKyBcIi1Qb2xpY3lcIixcbiAgICAgIHN0YXRlbWVudHM6IFtcbiAgICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgXCJlY3I6R2V0QXV0aG9yaXphdGlvblRva2VuXCIsXG4gICAgICAgICAgICBcImVjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHlcIixcbiAgICAgICAgICAgIFwiZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXJcIixcbiAgICAgICAgICAgIFwiZWNyOkJhdGNoR2V0SW1hZ2VcIixcbiAgICAgICAgICAgIFwibG9nczpDcmVhdGVMb2dTdHJlYW1cIixcbiAgICAgICAgICAgIFwibG9nczpDcmVhdGVMb2dHcm91cFwiLFxuICAgICAgICAgICAgXCJsb2dzOlB1dExvZ0V2ZW50c1wiLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbXCIqXCJdLCBcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGFza1JvbGUuYXR0YWNoSW5saW5lUG9saWN5KGVjc1BvbGljeSk7XG4gICAgdGFza1JvbGUuYWRkTWFuYWdlZFBvbGljeShcbiAgICAgIE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKFxuICAgICAgICBcIkFtYXpvbkVDMkNvbnRhaW5lclJlZ2lzdHJ5UG93ZXJVc2VyXCJcbiAgICAgIClcbiAgICApO1xuICAgIHRhc2tSb2xlLmFkZE1hbmFnZWRQb2xpY3koXG4gICAgICBNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZShcIkFtYXpvbkVDU19GdWxsQWNjZXNzXCIpXG4gICAgKTtcbiAgICB0YXNrUm9sZS5hZGRNYW5hZ2VkUG9saWN5KFxuICAgICAgTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoXCJDbG91ZFdhdGNoTG9nc0Z1bGxBY2Nlc3NcIilcbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogNS4gRUNTIFRhc2tcbiAgICAgKi9cblxuICAgIC8qKiA1LjEuIENyZWF0ZSBFQ1MgVGFzayBkZWZpbml0aW9uICovXG4gICAgY29uc3QgdGFza0RlZiA9IG5ldyBGYXJnYXRlVGFza0RlZmluaXRpb24oXG4gICAgICBwYXJlbnQsXG4gICAgICBpZCArIFwiLUZhcmdhdGVUYXNrRGVmXCIsXG4gICAgICB7XG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiBwcm9wcy5tZW1vcnlMaW1pdE1pQiAsXG4gICAgICAgIGNwdTogcHJvcHMuY3B1ICxcbiAgICAgICAgZXhlY3V0aW9uUm9sZTogdGFza1JvbGUsXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8qKiA1LjIuIEFkZCBDb250YWluZXIgRG9ja2VyLUltYWdlICovXG4gICAgY29uc3QgYXBwQ29udGFpbmVyID0gbmV3IENvbnRhaW5lckRlZmluaXRpb24oXG4gICAgICBwYXJlbnQsXG4gICAgICBpZCArIFwiLUNvbnRhaW5lckRlZlwiLFxuICAgICAgeyBcbiAgICAgICAgaW1hZ2U6IENvbnRhaW5lckltYWdlLmZyb21Bc3NldChwcm9wcy5jb2RlbG9jYXRpb24pLFxuICAgICAgICB0YXNrRGVmaW5pdGlvbjogdGFza0RlZixcbiAgICAgICAgbG9nZ2luZzogbmV3IEF3c0xvZ0RyaXZlcih7XG4gICAgICAgICAgc3RyZWFtUHJlZml4OiBpZCxcbiAgICAgICAgfSksXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8qKiA1LjMuIFBvcnQgbWFwcGluZyAqL1xuICAgIGFwcENvbnRhaW5lci5hZGRQb3J0TWFwcGluZ3Moe1xuICAgICAgLy8gaG9zdFBvcnQ6IHByb3BzLmhvc3RQb3J0LFxuICAgICAgY29udGFpbmVyUG9ydDogcHJvcHMuY29udGFpbmVyUG9ydCxcbiAgICAgIHByb3RvY29sOiBQcm90b2NvbC5UQ1AsXG4gICAgfSk7XG5cbiAgICAvKiogNi4gQ3JlYXRlIEZhcmdhdGUgU2VydmljZSAqL1xuICAgIHRoaXMuZmdzZXJ2aWNlID0gbmV3IEZhcmdhdGVTZXJ2aWNlKHBhcmVudCwgaWQgKyBcIi1GYXJnYXRlU2VydmljZVwiLCB7XG4gICAgICBjbHVzdGVyOiBwcm9wcy5jbHVzdGVyLFxuICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWYsXG4gICAgICBkZXNpcmVkQ291bnQ6IHByb3BzLmRlc2lyZWRDb3VudCAsXG4gICAgICBtYXhIZWFsdGh5UGVyY2VudDogcHJvcHMubWF4SGVhbHRoeVBlcmNlbnQgLFxuICAgICAgbWluSGVhbHRoeVBlcmNlbnQ6IHByb3BzLm1pbkhlYWx0aHlQZXJjZW50ICxcbiAgICAgIC8vIHNlY3VyaXR5R3JvdXA6IHByb3BzLnNlY3VyaXR5R3JwLFxuICAgICAgYXNzaWduUHVibGljSXA6IHRydWUsXG4gICAgICB2cGNTdWJuZXRzOiB7IFxuICAgICAgICBzdWJuZXRUeXBlOiBwcm9wcy5zdWJuZXRQcml2YXRlID8gU3VibmV0VHlwZS5QUklWQVRFOiBTdWJuZXRUeXBlLlBVQkxJQ1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogRklYTUUgQ29ubmVjdCBzZXJ2aWNlIHRvIFRhcmdldEdyb3VwXG4gICAgICogTk9URTogVGhpcyBkb2VzIG5vdCBpbnRyb2R1Y2UgYSBjeWNsZSBiZWNhdXNlIEVDUyBTZXJ2aWNlcyBhcmUgc2VsZi1yZWdpc3RlcmluZy5cbiAgICAgKiAodGhleSBwb2ludCB0byB0aGUgVGFyZ2V0R3JvdXAgaW5zdGVhZCBvZiB0aGUgb3RoZXIgd2F5IGFyb3VuZCkuXG4gICAgICovIFxuICAgIC8vIHByb3BzLnRhcmdldEdyb3VwLmFkZFRhcmdldCh0aGlzLmZnc2VydmljZSk7XG5cbiAgICBwcm9wcy5sb2FkQmFsYW5jZXJMaXN0ZW5lci5hZGRUYXJnZXRzKGlkICsgXCItVGFyZ2V0R3JvdXBcIiwge1xuICAgICAgcG9ydDogcHJvcHMuaG9zdFBvcnQsXG4gICAgICB0YXJnZXRzOiBbdGhpcy5mZ3NlcnZpY2VdLFxuICAgICAgcHJpb3JpdHk6IHByb3BzLnByaW9yaXR5LFxuICAgICAgcGF0aFBhdHRlcm46IHByb3BzLnBhdGhQYXR0ZXJuLFxuICAgIH0pO1xuXG4gIH1cbn0iXX0=