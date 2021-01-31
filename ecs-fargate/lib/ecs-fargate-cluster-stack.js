"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsFargateClusterStack = void 0;
const cdk = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_elasticloadbalancingv2_1 = require("@aws-cdk/aws-elasticloadbalancingv2");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
/**
 * VPC >> ECS Cluster
 * Shared Load Balancer: create an empty TargetGroup in the Shared ALB, and register a Service into it in the ServiceStack.
 */
class EcsFargateClusterStack extends cdk.Construct {
    constructor(parent, id, props) {
        var _a, _b, _c, _d;
        super(parent, id);
        /**
         * 1. ECS Cluster
         */
        this.cluster = new aws_ecs_1.Cluster(parent, id + "-Cluster", {
            vpc: props.vpc,
            clusterName: (_a = props.clusterName) !== null && _a !== void 0 ? _a : id + "-Cluster",
            containerInsights: (_b = props.containerInsights) !== null && _b !== void 0 ? _b : true
        });
        /**
         * 2. ApplicationLoadBalancer
         */
        this.alb = new aws_elasticloadbalancingv2_1.ApplicationLoadBalancer(parent, id + '-alb', {
            vpc: props.vpc,
            internetFacing: true,
            ipAddressType: aws_elasticloadbalancingv2_1.IpAddressType.IPV4,
            securityGroup: props.securityGrp,
            vpcSubnets: props.vpc.selectSubnets({
                subnetType: aws_ec2_1.SubnetType.PUBLIC,
            }),
            loadBalancerName: (_c = props.loadBalancerName) !== null && _c !== void 0 ? _c : id + '-alb',
        });
        /**
         * 3. Application TargetGroup
         */
        const targetGrp = new aws_elasticloadbalancingv2_1.ApplicationTargetGroup(parent, id + '-TGrp', {
            vpc: props.vpc,
            protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTP,
            port: props.allowPort,
            targetType: aws_elasticloadbalancingv2_1.TargetType.IP,
            targetGroupName: (_d = props.targetGroupName) !== null && _d !== void 0 ? _d : id + '-TGrp',
        });
        /**
         * 4. Application addListener
         */
        this.loadBalancerListener = this.alb.addListener("Listener", {
            protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTP,
            port: props.allowPort,
            open: true,
            defaultTargetGroups: [targetGrp],
        });
        /**
         * 5. CloudFormation Output
         */
        new cdk.CfnOutput(parent, "ApplicationLoadBalancer DNS", {
            value: this.alb.loadBalancerDnsName,
        });
    }
}
exports.EcsFargateClusterStack = EcsFargateClusterStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWZhcmdhdGUtY2x1c3Rlci1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjcy1mYXJnYXRlLWNsdXN0ZXItc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLDhDQUFtRTtBQUNuRSxvRkFBMks7QUFDM0ssOENBQTJEO0FBcUIzRDs7O0dBR0c7QUFDSCxNQUFhLHNCQUF1QixTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBT3ZELFlBQVksTUFBcUIsRUFBRSxFQUFVLEVBQUUsS0FBa0M7O1FBRS9FLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbEI7O1dBRUc7UUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksaUJBQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLFVBQVUsRUFBRTtZQUNsRCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxXQUFXLFFBQUUsS0FBSyxDQUFDLFdBQVcsbUNBQUksRUFBRSxHQUFHLFVBQVU7WUFDakQsaUJBQWlCLFFBQUUsS0FBSyxDQUFDLGlCQUFpQixtQ0FBSSxJQUFJO1NBQ25ELENBQUMsQ0FBQztRQUVIOztXQUVHO1FBQ0gsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLG9EQUF1QixDQUNwQyxNQUFNLEVBQ04sRUFBRSxHQUFHLE1BQU0sRUFDWDtZQUNFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGFBQWEsRUFBRSwwQ0FBYSxDQUFDLElBQUk7WUFDakMsYUFBYSxFQUFFLEtBQUssQ0FBQyxXQUFXO1lBQ2hDLFVBQVUsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztnQkFDbEMsVUFBVSxFQUFFLG9CQUFVLENBQUMsTUFBTTthQUM5QixDQUFDO1lBQ0YsZ0JBQWdCLFFBQUUsS0FBSyxDQUFDLGdCQUFnQixtQ0FBSSxFQUFFLEdBQUcsTUFBTTtTQUN4RCxDQUNGLENBQUM7UUFFRjs7V0FFRztRQUNILE1BQU0sU0FBUyxHQUFHLElBQUksbURBQXNCLENBQzFDLE1BQU0sRUFDTixFQUFFLEdBQUcsT0FBTyxFQUNaO1lBQ0UsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsUUFBUSxFQUFFLGdEQUFtQixDQUFDLElBQUk7WUFDbEMsSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQ3JCLFVBQVUsRUFBRSx1Q0FBVSxDQUFDLEVBQUU7WUFDekIsZUFBZSxRQUFFLEtBQUssQ0FBQyxlQUFlLG1DQUFJLEVBQUUsR0FBRyxPQUFPO1NBQ3ZELENBQ0YsQ0FBQztRQUVGOztXQUVHO1FBRUgsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRTtZQUMzRCxRQUFRLEVBQUUsZ0RBQW1CLENBQUMsSUFBSTtZQUNsQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVM7WUFDckIsSUFBSSxFQUFFLElBQUk7WUFDVixtQkFBbUIsRUFBRSxDQUFDLFNBQVMsQ0FBQztTQUNqQyxDQUFDLENBQUM7UUFFSDs7V0FFRztRQUNILElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsNkJBQTZCLEVBQUU7WUFDdkQsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CO1NBQ3BDLENBQUMsQ0FBQztJQUVMLENBQUM7Q0FDRjtBQXhFRCx3REF3RUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSBcIkBhd3MtY2RrL2NvcmVcIjtcbmltcG9ydCB7IElWcGMsIFNlY3VyaXR5R3JvdXAsIFN1Ym5ldFR5cGUgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWVjMlwiO1xuaW1wb3J0IHsgQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIsIEFwcGxpY2F0aW9uTGlzdGVuZXIsIEFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAsIElwQWRkcmVzc1R5cGUsIEFwcGxpY2F0aW9uUHJvdG9jb2wsIFRhcmdldFR5cGUgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjJcIjtcbmltcG9ydCB7IENsdXN0ZXIsIEZhcmdhdGVTZXJ2aWNlIH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1lY3NcIjtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gZWNzLkNsdXN0ZXJQcm9wcyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS9sYXRlc3QvdHlwZXNjcmlwdC9hcGkvYXdzLWVjcy9jbHVzdGVycHJvcHMuaHRtbCNhd3NfZWNzX0NsdXN0ZXJQcm9wc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEVjc0ZhcmdhdGVDbHVzdGVyU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgcmVhZG9ubHkgdnBjOiBJVnBjO1xuICByZWFkb25seSBjbHVzdGVyTmFtZT86IHN0cmluZztcbiAgcmVhZG9ubHkgY29udGFpbmVySW5zaWdodHM/OiBib29sZWFuO1xuXG4gIHJlYWRvbmx5IGxvYWRCYWxhbmNlck5hbWU/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JwOiBTZWN1cml0eUdyb3VwO1xuXG4gIHJlYWRvbmx5IHRhcmdldEdyb3VwTmFtZT86IHN0cmluZztcbiAgcmVhZG9ubHkgYWxsb3dQb3J0OiBudW1iZXI7XG5cbiAgcmVhZG9ubHkgdGFncz86IHtcbiAgICBba2V5OiBzdHJpbmddOiBzdHJpbmc7XG4gIH07XG59XG5cbi8qKlxuICogVlBDID4+IEVDUyBDbHVzdGVyXG4gKiBTaGFyZWQgTG9hZCBCYWxhbmNlcjogY3JlYXRlIGFuIGVtcHR5IFRhcmdldEdyb3VwIGluIHRoZSBTaGFyZWQgQUxCLCBhbmQgcmVnaXN0ZXIgYSBTZXJ2aWNlIGludG8gaXQgaW4gdGhlIFNlcnZpY2VTdGFjay5cbiAqL1xuZXhwb3J0IGNsYXNzIEVjc0ZhcmdhdGVDbHVzdGVyU3RhY2sgZXh0ZW5kcyBjZGsuQ29uc3RydWN0IHtcbiAgcmVhZG9ubHkgY2x1c3RlcjogQ2x1c3RlcjtcbiAgcmVhZG9ubHkgYWxiOiBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlcjtcbiAgcmVhZG9ubHkgZmdzZXJ2aWNlOiBGYXJnYXRlU2VydmljZTtcbiAgcmVhZG9ubHkgbG9hZEJhbGFuY2VyTGlzdGVuZXI6IEFwcGxpY2F0aW9uTGlzdGVuZXI7XG4gIHB1YmxpYyByZWFkb25seSB0YXJnZXRHcm91cDogQXBwbGljYXRpb25UYXJnZXRHcm91cDtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFY3NGYXJnYXRlQ2x1c3RlclN0YWNrUHJvcHMpIHtcblxuICAgIHN1cGVyKHBhcmVudCwgaWQpO1xuXG4gICAgLyoqXG4gICAgICogMS4gRUNTIENsdXN0ZXJcbiAgICAgKi9cbiAgICB0aGlzLmNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihwYXJlbnQsIGlkICsgXCItQ2x1c3RlclwiLCB7XG4gICAgICB2cGM6IHByb3BzLnZwYyxcbiAgICAgIGNsdXN0ZXJOYW1lOiBwcm9wcy5jbHVzdGVyTmFtZSA/PyBpZCArIFwiLUNsdXN0ZXJcIixcbiAgICAgIGNvbnRhaW5lckluc2lnaHRzOiBwcm9wcy5jb250YWluZXJJbnNpZ2h0cyA/PyB0cnVlXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiAyLiBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlclxuICAgICAqL1xuICAgIHRoaXMuYWxiID0gbmV3IEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKFxuICAgICAgcGFyZW50LFxuICAgICAgaWQgKyAnLWFsYicsXG4gICAgICB7XG4gICAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgICAgICBpbnRlcm5ldEZhY2luZzogdHJ1ZSxcbiAgICAgICAgaXBBZGRyZXNzVHlwZTogSXBBZGRyZXNzVHlwZS5JUFY0LFxuICAgICAgICBzZWN1cml0eUdyb3VwOiBwcm9wcy5zZWN1cml0eUdycCxcbiAgICAgICAgdnBjU3VibmV0czogcHJvcHMudnBjLnNlbGVjdFN1Ym5ldHMoe1xuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICB9KSxcbiAgICAgICAgbG9hZEJhbGFuY2VyTmFtZTogcHJvcHMubG9hZEJhbGFuY2VyTmFtZSA/PyBpZCArICctYWxiJyxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogMy4gQXBwbGljYXRpb24gVGFyZ2V0R3JvdXBcbiAgICAgKi9cbiAgICBjb25zdCB0YXJnZXRHcnAgPSBuZXcgQXBwbGljYXRpb25UYXJnZXRHcm91cChcbiAgICAgIHBhcmVudCxcbiAgICAgIGlkICsgJy1UR3JwJyxcbiAgICAgIHtcbiAgICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgICAgIHByb3RvY29sOiBBcHBsaWNhdGlvblByb3RvY29sLkhUVFAsXG4gICAgICAgIHBvcnQ6IHByb3BzLmFsbG93UG9ydCxcbiAgICAgICAgdGFyZ2V0VHlwZTogVGFyZ2V0VHlwZS5JUCxcbiAgICAgICAgdGFyZ2V0R3JvdXBOYW1lOiBwcm9wcy50YXJnZXRHcm91cE5hbWUgPz8gaWQgKyAnLVRHcnAnLFxuICAgICAgfVxuICAgICk7XG5cbiAgICAvKipcbiAgICAgKiA0LiBBcHBsaWNhdGlvbiBhZGRMaXN0ZW5lclxuICAgICAqL1xuXG4gICAgdGhpcy5sb2FkQmFsYW5jZXJMaXN0ZW5lciA9IHRoaXMuYWxiLmFkZExpc3RlbmVyKFwiTGlzdGVuZXJcIiwge1xuICAgICAgcHJvdG9jb2w6IEFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUCxcbiAgICAgIHBvcnQ6IHByb3BzLmFsbG93UG9ydCxcbiAgICAgIG9wZW46IHRydWUsXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbdGFyZ2V0R3JwXSxcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIDUuIENsb3VkRm9ybWF0aW9uIE91dHB1dFxuICAgICAqL1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHBhcmVudCwgXCJBcHBsaWNhdGlvbkxvYWRCYWxhbmNlciBETlNcIiwge1xuICAgICAgdmFsdWU6IHRoaXMuYWxiLmxvYWRCYWxhbmNlckRuc05hbWUsXG4gICAgfSk7XG5cbiAgfVxufSJdfQ==