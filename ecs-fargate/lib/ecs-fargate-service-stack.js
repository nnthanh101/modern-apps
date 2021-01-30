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
class EcsFargateServiceStack extends cdk.Stack {
    constructor(parent, id, props) {
        var _a, _b;
        super(parent, id, props);
        /**
         * 1.ECS Task
         **/
        const taskRole = new aws_iam_1.Role(this, id + "-Role", {
            assumedBy: new aws_iam_1.ServicePrincipal("ecs-tasks.amazonaws.com"),
            description: "Adds managed policies to ecs role for ecr image pulls and execution",
            roleName: (_a = props.roleNameFargate) !== null && _a !== void 0 ? _a : id + "-Role",
        });
        const ecsPolicy = new aws_iam_1.Policy(this, "-Policy", {
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
        const taskDef = new aws_ecs_2.FargateTaskDefinition(this, id + "-FargateTaskDef", {
            memoryLimitMiB: props.memoryLimitMiB,
            cpu: props.cpu,
            executionRole: taskRole,
        });
        /** 5.2. Add Container Docker-Image */
        const appContainer = new aws_ecs_2.ContainerDefinition(this, id + "-ContainerDef", {
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
        this.fgservice = new aws_ecs_2.FargateService(this, id + "-FargateService", {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWZhcmdhdGUtc2VydmljZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjcy1mYXJnYXRlLXNlcnZpY2Utc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBRXJDLDhDQUFrRTtBQUNsRSw4Q0FBZ0Q7QUFDaEQsOENBQXFKO0FBQ3JKLDhDQUF5RztBQTZCekc7O0dBRUc7QUFDSCwrREFBK0Q7QUFDL0QsTUFBYSxzQkFBdUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUVuRCxZQUFZLE1BQXFCLEVBQUUsRUFBVSxFQUFFLEtBQWtDOztRQUMvRSxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV6Qjs7WUFFSTtRQUNKLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBSSxDQUFDLElBQUksRUFBRSxFQUFFLEdBQUcsT0FBTyxFQUFFO1lBQzVDLFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHlCQUF5QixDQUFDO1lBQzFELFdBQVcsRUFBRSxxRUFBcUU7WUFDbEYsUUFBUSxRQUFFLEtBQUssQ0FBQyxlQUFlLG1DQUFJLEVBQUUsR0FBRyxPQUFPO1NBQ2hELENBQUMsQ0FBQztRQUdILE1BQU0sU0FBUyxHQUFXLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ3BELFVBQVUsUUFBRSxLQUFLLENBQUMsaUJBQWlCLG1DQUFJLEVBQUUsR0FBRyxTQUFTO1lBQ3JELFVBQVUsRUFBRTtnQkFDVixJQUFJLHlCQUFlLENBQUM7b0JBQ2xCLE1BQU0sRUFBRSxnQkFBTSxDQUFDLEtBQUs7b0JBQ3BCLE9BQU8sRUFBRTt3QkFDUCwyQkFBMkI7d0JBQzNCLGlDQUFpQzt3QkFDakMsNEJBQTRCO3dCQUM1QixtQkFBbUI7d0JBQ25CLHNCQUFzQjt3QkFDdEIscUJBQXFCO3dCQUNyQixtQkFBbUI7cUJBQ3BCO29CQUNELFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztpQkFDakIsQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDdkIsdUJBQWEsQ0FBQyx3QkFBd0IsQ0FDcEMscUNBQXFDLENBQ3RDLENBQ0YsQ0FBQztRQUNGLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FDdkIsdUJBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxzQkFBc0IsQ0FBQyxDQUMvRCxDQUFDO1FBQ0YsUUFBUSxDQUFDLGdCQUFnQixDQUN2Qix1QkFBYSxDQUFDLHdCQUF3QixDQUFDLDBCQUEwQixDQUFDLENBQ25FLENBQUM7UUFFRjs7V0FFRztRQUVILHNDQUFzQztRQUN0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLCtCQUFxQixDQUN2QyxJQUFJLEVBQ0osRUFBRSxHQUFHLGlCQUFpQixFQUN0QjtZQUNFLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztZQUNwQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxhQUFhLEVBQUUsUUFBUTtTQUN4QixDQUNGLENBQUM7UUFFRixzQ0FBc0M7UUFDdEMsTUFBTSxZQUFZLEdBQUcsSUFBSSw2QkFBbUIsQ0FDMUMsSUFBSSxFQUNKLEVBQUUsR0FBRyxlQUFlLEVBQ3BCO1lBQ0UsS0FBSyxFQUFFLHdCQUFjLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7WUFDbkQsY0FBYyxFQUFFLE9BQU87WUFDdkIsT0FBTyxFQUFFLElBQUksc0JBQVksQ0FBQztnQkFDeEIsWUFBWSxFQUFFLEVBQUU7YUFDakIsQ0FBQztTQUNILENBQ0YsQ0FBQztRQUVGLHdCQUF3QjtRQUN4QixZQUFZLENBQUMsZUFBZSxDQUFDO1lBQzNCLDRCQUE0QjtZQUM1QixhQUFhLEVBQUUsS0FBSyxDQUFDLGFBQWE7WUFDbEMsUUFBUSxFQUFFLGtCQUFRLENBQUMsR0FBRztTQUN2QixDQUFDLENBQUM7UUFFSCxnQ0FBZ0M7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHdCQUFjLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxpQkFBaUIsRUFBRTtZQUNoRSxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU87WUFDdEIsY0FBYyxFQUFFLE9BQU87WUFDdkIsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1lBQ2hDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUI7WUFDMUMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQjtZQUMxQyxvQ0FBb0M7WUFDcEMsY0FBYyxFQUFFLElBQUk7WUFDcEIsVUFBVSxFQUFFO2dCQUNWLFVBQVUsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxvQkFBVSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUMsb0JBQVUsQ0FBQyxNQUFNO2FBQ3hFO1NBQ0YsQ0FBQyxDQUFDO1FBRUg7Ozs7V0FJRztRQUNILCtDQUErQztRQUUvQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxjQUFjLEVBQUU7WUFDekQsSUFBSSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3BCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDekIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3hCLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztTQUMvQixDQUFDLENBQUM7SUFFTCxDQUFDO0NBQ0Y7QUEvR0Qsd0RBK0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgeyBSZXBvc2l0b3J5IH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1lY3JcIjtcbmltcG9ydCB7IFZwYywgU2VjdXJpdHlHcm91cCwgU3VibmV0VHlwZSB9IGZyb20gXCJAYXdzLWNkay9hd3MtZWMyXCI7XG5pbXBvcnQgeyBBd3NMb2dEcml2ZXIgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWVjc1wiO1xuaW1wb3J0IHsgQ2x1c3RlciwgRmFyZ2F0ZVNlcnZpY2UsIEZhcmdhdGVTZXJ2aWNlUHJvcHMsIEZhcmdhdGVUYXNrRGVmaW5pdGlvbiwgQ29udGFpbmVyRGVmaW5pdGlvbiwgQ29udGFpbmVySW1hZ2UsIFByb3RvY29sfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWVjc1wiO1xuaW1wb3J0IHsgU2VydmljZVByaW5jaXBhbCwgUm9sZSwgUG9saWN5LCBQb2xpY3lTdGF0ZW1lbnQsIEVmZmVjdCwgTWFuYWdlZFBvbGljeX0gZnJvbSBcIkBhd3MtY2RrL2F3cy1pYW1cIjtcbmltcG9ydCB7IEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAsIEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyLCBJcEFkZHJlc3NUeXBlLCBBcHBsaWNhdGlvblByb3RvY29sLCBUYXJnZXRUeXBlLCBBcHBsaWNhdGlvbkxpc3RlbmVyfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBFY3NGYXJnYXRlU2VydmljZVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIHJlYWRvbmx5IGNsdXN0ZXI6IENsdXN0ZXI7XG4gIHJlYWRvbmx5IGFsYjogQXBwbGljYXRpb25Mb2FkQmFsYW5jZXI7XG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlckxpc3RlbmVyOiBBcHBsaWNhdGlvbkxpc3RlbmVyO1xuICAvLyBGSVhNRVxuICAvLyB0YXJnZXRHcm91cDogQXBwbGljYXRpb25UYXJnZXRHcm91cDtcbiAgXG4gIHJlYWRvbmx5IGNvZGVsb2NhdGlvbjogc3RyaW5nO1xuICByZWFkb25seSBjb250YWluZXJQb3J0OiBudW1iZXI7XG4gIHJlYWRvbmx5IGhvc3RQb3J0OiBudW1iZXI7XG5cbiAgcmVhZG9ubHkgcm9sZU5hbWVGYXJnYXRlPzogc3RyaW5nO1xuICByZWFkb25seSBwb2xpY3lOYW1lRmFyZ2F0ZT86IHN0cmluZztcbiAgcmVhZG9ubHkgbWVtb3J5TGltaXRNaUI/OiBudW1iZXI7XG4gIHJlYWRvbmx5IGNwdT86IG51bWJlcjtcbiAgcmVhZG9ubHkgZGVzaXJlZENvdW50PzogbnVtYmVyO1xuICByZWFkb25seSBtYXhIZWFsdGh5UGVyY2VudD86IG51bWJlcjtcbiAgcmVhZG9ubHkgbWluSGVhbHRoeVBlcmNlbnQ/OiBudW1iZXI7XG4gIHJlYWRvbmx5IHByaW9yaXR5OiBudW1iZXI7XG4gIHJlYWRvbmx5IHBhdGhQYXR0ZXJuOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHN1Ym5ldFByaXZhdGU/OiBib29sZWFuO1xuICByZWFkb25seSB0YWdzPzoge1xuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZztcbiAgfTtcbn1cblxuLyoqXG4gKiBFQ1MtRmFyZ2F0ZSBTZXJ2aWNlIFN0YWNrXG4gKi9cbi8vIGV4cG9ydCBjbGFzcyBFY3NGYXJnYXRlU2VydmljZVN0YWNrIGV4dGVuZHMgRmFyZ2F0ZVNlcnZpY2Uge1xuZXhwb3J0IGNsYXNzIEVjc0ZhcmdhdGVTZXJ2aWNlU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICByZWFkb25seSBmZ3NlcnZpY2U6IEZhcmdhdGVTZXJ2aWNlO1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFY3NGYXJnYXRlU2VydmljZVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihwYXJlbnQsIGlkLCBwcm9wcyk7XG4gICAgXG4gICAgLyoqXG4gICAgICogMS5FQ1MgVGFza1xuICAgICAqKi9cbiAgICBjb25zdCB0YXNrUm9sZSA9IG5ldyBSb2xlKHRoaXMsIGlkICsgXCItUm9sZVwiLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKFwiZWNzLXRhc2tzLmFtYXpvbmF3cy5jb21cIiksXG4gICAgICBkZXNjcmlwdGlvbjogXCJBZGRzIG1hbmFnZWQgcG9saWNpZXMgdG8gZWNzIHJvbGUgZm9yIGVjciBpbWFnZSBwdWxscyBhbmQgZXhlY3V0aW9uXCIsXG4gICAgICByb2xlTmFtZTogcHJvcHMucm9sZU5hbWVGYXJnYXRlID8/IGlkICsgXCItUm9sZVwiLFxuICAgIH0pO1xuICAgIFxuIFxuICAgIGNvbnN0IGVjc1BvbGljeTogUG9saWN5ID0gbmV3IFBvbGljeSh0aGlzLCBcIi1Qb2xpY3lcIiwge1xuICAgICAgcG9saWN5TmFtZTogcHJvcHMucG9saWN5TmFtZUZhcmdhdGUgPz8gaWQgKyBcIi1Qb2xpY3lcIixcbiAgICAgIHN0YXRlbWVudHM6IFtcbiAgICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgXCJlY3I6R2V0QXV0aG9yaXphdGlvblRva2VuXCIsXG4gICAgICAgICAgICBcImVjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHlcIixcbiAgICAgICAgICAgIFwiZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXJcIixcbiAgICAgICAgICAgIFwiZWNyOkJhdGNoR2V0SW1hZ2VcIixcbiAgICAgICAgICAgIFwibG9nczpDcmVhdGVMb2dTdHJlYW1cIixcbiAgICAgICAgICAgIFwibG9nczpDcmVhdGVMb2dHcm91cFwiLFxuICAgICAgICAgICAgXCJsb2dzOlB1dExvZ0V2ZW50c1wiLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbXCIqXCJdLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICB0YXNrUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3koZWNzUG9saWN5KTtcbiAgICB0YXNrUm9sZS5hZGRNYW5hZ2VkUG9saWN5KFxuICAgICAgTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoXG4gICAgICAgIFwiQW1hem9uRUMyQ29udGFpbmVyUmVnaXN0cnlQb3dlclVzZXJcIlxuICAgICAgKVxuICAgICk7XG4gICAgdGFza1JvbGUuYWRkTWFuYWdlZFBvbGljeShcbiAgICAgIE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKFwiQW1hem9uRUNTX0Z1bGxBY2Nlc3NcIilcbiAgICApO1xuICAgIHRhc2tSb2xlLmFkZE1hbmFnZWRQb2xpY3koXG4gICAgICBNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZShcIkNsb3VkV2F0Y2hMb2dzRnVsbEFjY2Vzc1wiKVxuICAgICk7XG5cbiAgICAvKipcbiAgICAgKiA1LiBFQ1MgVGFza1xuICAgICAqL1xuXG4gICAgLyoqIDUuMS4gQ3JlYXRlIEVDUyBUYXNrIGRlZmluaXRpb24gKi9cbiAgICBjb25zdCB0YXNrRGVmID0gbmV3IEZhcmdhdGVUYXNrRGVmaW5pdGlvbihcbiAgICAgIHRoaXMsXG4gICAgICBpZCArIFwiLUZhcmdhdGVUYXNrRGVmXCIsXG4gICAgICB7XG4gICAgICAgIG1lbW9yeUxpbWl0TWlCOiBwcm9wcy5tZW1vcnlMaW1pdE1pQiAsXG4gICAgICAgIGNwdTogcHJvcHMuY3B1ICxcbiAgICAgICAgZXhlY3V0aW9uUm9sZTogdGFza1JvbGUsXG4gICAgICB9XG4gICAgKTtcblxuICAgIC8qKiA1LjIuIEFkZCBDb250YWluZXIgRG9ja2VyLUltYWdlICovXG4gICAgY29uc3QgYXBwQ29udGFpbmVyID0gbmV3IENvbnRhaW5lckRlZmluaXRpb24oXG4gICAgICB0aGlzLFxuICAgICAgaWQgKyBcIi1Db250YWluZXJEZWZcIixcbiAgICAgIHsgXG4gICAgICAgIGltYWdlOiBDb250YWluZXJJbWFnZS5mcm9tQXNzZXQocHJvcHMuY29kZWxvY2F0aW9uKSxcbiAgICAgICAgdGFza0RlZmluaXRpb246IHRhc2tEZWYsXG4gICAgICAgIGxvZ2dpbmc6IG5ldyBBd3NMb2dEcml2ZXIoe1xuICAgICAgICAgIHN0cmVhbVByZWZpeDogaWQsXG4gICAgICAgIH0pLFxuICAgICAgfVxuICAgICk7XG5cbiAgICAvKiogNS4zLiBQb3J0IG1hcHBpbmcgKi9cbiAgICBhcHBDb250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHtcbiAgICAgIC8vIGhvc3RQb3J0OiBwcm9wcy5ob3N0UG9ydCxcbiAgICAgIGNvbnRhaW5lclBvcnQ6IHByb3BzLmNvbnRhaW5lclBvcnQsXG4gICAgICBwcm90b2NvbDogUHJvdG9jb2wuVENQLFxuICAgIH0pO1xuXG4gICAgLyoqIDYuIENyZWF0ZSBGYXJnYXRlIFNlcnZpY2UgKi9cbiAgICB0aGlzLmZnc2VydmljZSA9IG5ldyBGYXJnYXRlU2VydmljZSh0aGlzLCBpZCArIFwiLUZhcmdhdGVTZXJ2aWNlXCIsIHtcbiAgICAgIGNsdXN0ZXI6IHByb3BzLmNsdXN0ZXIsXG4gICAgICB0YXNrRGVmaW5pdGlvbjogdGFza0RlZixcbiAgICAgIGRlc2lyZWRDb3VudDogcHJvcHMuZGVzaXJlZENvdW50ICxcbiAgICAgIG1heEhlYWx0aHlQZXJjZW50OiBwcm9wcy5tYXhIZWFsdGh5UGVyY2VudCAsXG4gICAgICBtaW5IZWFsdGh5UGVyY2VudDogcHJvcHMubWluSGVhbHRoeVBlcmNlbnQgLFxuICAgICAgLy8gc2VjdXJpdHlHcm91cDogcHJvcHMuc2VjdXJpdHlHcnAsXG4gICAgICBhc3NpZ25QdWJsaWNJcDogdHJ1ZSxcbiAgICAgIHZwY1N1Ym5ldHM6IHsgXG4gICAgICAgIHN1Ym5ldFR5cGU6IHByb3BzLnN1Ym5ldFByaXZhdGUgPyBTdWJuZXRUeXBlLlBSSVZBVEU6IFN1Ym5ldFR5cGUuUFVCTElDXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBGSVhNRSBDb25uZWN0IHNlcnZpY2UgdG8gVGFyZ2V0R3JvdXBcbiAgICAgKiBOT1RFOiBUaGlzIGRvZXMgbm90IGludHJvZHVjZSBhIGN5Y2xlIGJlY2F1c2UgRUNTIFNlcnZpY2VzIGFyZSBzZWxmLXJlZ2lzdGVyaW5nLlxuICAgICAqICh0aGV5IHBvaW50IHRvIHRoZSBUYXJnZXRHcm91cCBpbnN0ZWFkIG9mIHRoZSBvdGhlciB3YXkgYXJvdW5kKS5cbiAgICAgKi8gXG4gICAgLy8gcHJvcHMudGFyZ2V0R3JvdXAuYWRkVGFyZ2V0KHRoaXMuZmdzZXJ2aWNlKTtcblxuICAgIHByb3BzLmxvYWRCYWxhbmNlckxpc3RlbmVyLmFkZFRhcmdldHMoaWQgKyBcIi1UYXJnZXRHcm91cFwiLCB7XG4gICAgICBwb3J0OiBwcm9wcy5ob3N0UG9ydCxcbiAgICAgIHRhcmdldHM6IFt0aGlzLmZnc2VydmljZV0sXG4gICAgICBwcmlvcml0eTogcHJvcHMucHJpb3JpdHksXG4gICAgICBwYXRoUGF0dGVybjogcHJvcHMucGF0aFBhdHRlcm4sXG4gICAgfSk7XG5cbiAgfVxufSJdfQ==