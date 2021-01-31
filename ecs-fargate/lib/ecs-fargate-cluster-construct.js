"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsFargateClusterConstruct = void 0;
const cdk = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_elasticloadbalancingv2_1 = require("@aws-cdk/aws-elasticloadbalancingv2");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
/**
 * VPC >> ECS Cluster
 * Shared Load Balancer: create an empty TargetGroup in the Shared ALB, and register a Service into it in the ServiceStack.
 */
class EcsFargateClusterConstruct extends cdk.Construct {
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
exports.EcsFargateClusterConstruct = EcsFargateClusterConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWZhcmdhdGUtY2x1c3Rlci1jb25zdHJ1Y3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlY3MtZmFyZ2F0ZS1jbHVzdGVyLWNvbnN0cnVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsOENBQW1FO0FBQ25FLG9GQUEySztBQUMzSyw4Q0FBMkQ7QUFxQjNEOzs7R0FHRztBQUNILE1BQWEsMEJBQTJCLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFPM0QsWUFBWSxNQUFxQixFQUFFLEVBQVUsRUFBRSxLQUFrQzs7UUFFL0UsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVsQjs7V0FFRztRQUNILElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsVUFBVSxFQUFFO1lBQ2xELEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFdBQVcsUUFBRSxLQUFLLENBQUMsV0FBVyxtQ0FBSSxFQUFFLEdBQUcsVUFBVTtZQUNqRCxpQkFBaUIsUUFBRSxLQUFLLENBQUMsaUJBQWlCLG1DQUFJLElBQUk7U0FDbkQsQ0FBQyxDQUFDO1FBRUg7O1dBRUc7UUFDSCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksb0RBQXVCLENBQ3BDLE1BQU0sRUFDTixFQUFFLEdBQUcsTUFBTSxFQUNYO1lBQ0UsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO1lBQ2QsY0FBYyxFQUFFLElBQUk7WUFDcEIsYUFBYSxFQUFFLDBDQUFhLENBQUMsSUFBSTtZQUNqQyxhQUFhLEVBQUUsS0FBSyxDQUFDLFdBQVc7WUFDaEMsVUFBVSxFQUFFLEtBQUssQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO2dCQUNsQyxVQUFVLEVBQUUsb0JBQVUsQ0FBQyxNQUFNO2FBQzlCLENBQUM7WUFDRixnQkFBZ0IsUUFBRSxLQUFLLENBQUMsZ0JBQWdCLG1DQUFJLEVBQUUsR0FBRyxNQUFNO1NBQ3hELENBQ0YsQ0FBQztRQUVGOztXQUVHO1FBQ0gsTUFBTSxTQUFTLEdBQUcsSUFBSSxtREFBc0IsQ0FDMUMsTUFBTSxFQUNOLEVBQUUsR0FBRyxPQUFPLEVBQ1o7WUFDRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxRQUFRLEVBQUUsZ0RBQW1CLENBQUMsSUFBSTtZQUNsQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVM7WUFDckIsVUFBVSxFQUFFLHVDQUFVLENBQUMsRUFBRTtZQUN6QixlQUFlLFFBQUUsS0FBSyxDQUFDLGVBQWUsbUNBQUksRUFBRSxHQUFHLE9BQU87U0FDdkQsQ0FDRixDQUFDO1FBRUY7O1dBRUc7UUFFSCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFO1lBQzNELFFBQVEsRUFBRSxnREFBbUIsQ0FBQyxJQUFJO1lBQ2xDLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUztZQUNyQixJQUFJLEVBQUUsSUFBSTtZQUNWLG1CQUFtQixFQUFFLENBQUMsU0FBUyxDQUFDO1NBQ2pDLENBQUMsQ0FBQztRQUVIOztXQUVHO1FBQ0gsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSw2QkFBNkIsRUFBRTtZQUN2RCxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUI7U0FDcEMsQ0FBQyxDQUFDO0lBRUwsQ0FBQztDQUNGO0FBeEVELGdFQXdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0IHsgSVZwYywgU2VjdXJpdHlHcm91cCwgU3VibmV0VHlwZSB9IGZyb20gXCJAYXdzLWNkay9hd3MtZWMyXCI7XG5pbXBvcnQgeyBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlciwgQXBwbGljYXRpb25MaXN0ZW5lciwgQXBwbGljYXRpb25UYXJnZXRHcm91cCwgSXBBZGRyZXNzVHlwZSwgQXBwbGljYXRpb25Qcm90b2NvbCwgVGFyZ2V0VHlwZSB9IGZyb20gXCJAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2MlwiO1xuaW1wb3J0IHsgQ2x1c3RlciwgRmFyZ2F0ZVNlcnZpY2UgfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWVjc1wiO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBlY3MuQ2x1c3RlclByb3BzIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvYXBpL2xhdGVzdC90eXBlc2NyaXB0L2FwaS9hd3MtZWNzL2NsdXN0ZXJwcm9wcy5odG1sI2F3c19lY3NfQ2x1c3RlclByb3BzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWNzRmFyZ2F0ZUNsdXN0ZXJTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICByZWFkb25seSB2cGM6IElWcGM7XG4gIHJlYWRvbmx5IGNsdXN0ZXJOYW1lPzogc3RyaW5nO1xuICByZWFkb25seSBjb250YWluZXJJbnNpZ2h0cz86IGJvb2xlYW47XG5cbiAgcmVhZG9ubHkgbG9hZEJhbGFuY2VyTmFtZT86IHN0cmluZztcbiAgcmVhZG9ubHkgc2VjdXJpdHlHcnA6IFNlY3VyaXR5R3JvdXA7XG5cbiAgcmVhZG9ubHkgdGFyZ2V0R3JvdXBOYW1lPzogc3RyaW5nO1xuICByZWFkb25seSBhbGxvd1BvcnQ6IG51bWJlcjtcblxuICByZWFkb25seSB0YWdzPzoge1xuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZztcbiAgfTtcbn1cblxuLyoqXG4gKiBWUEMgPj4gRUNTIENsdXN0ZXJcbiAqIFNoYXJlZCBMb2FkIEJhbGFuY2VyOiBjcmVhdGUgYW4gZW1wdHkgVGFyZ2V0R3JvdXAgaW4gdGhlIFNoYXJlZCBBTEIsIGFuZCByZWdpc3RlciBhIFNlcnZpY2UgaW50byBpdCBpbiB0aGUgU2VydmljZVN0YWNrLlxuICovXG5leHBvcnQgY2xhc3MgRWNzRmFyZ2F0ZUNsdXN0ZXJDb25zdHJ1Y3QgZXh0ZW5kcyBjZGsuQ29uc3RydWN0IHtcbiAgcmVhZG9ubHkgY2x1c3RlcjogQ2x1c3RlcjtcbiAgcmVhZG9ubHkgYWxiOiBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlcjtcbiAgcmVhZG9ubHkgZmdzZXJ2aWNlOiBGYXJnYXRlU2VydmljZTtcbiAgcmVhZG9ubHkgbG9hZEJhbGFuY2VyTGlzdGVuZXI6IEFwcGxpY2F0aW9uTGlzdGVuZXI7XG4gIHB1YmxpYyByZWFkb25seSB0YXJnZXRHcm91cDogQXBwbGljYXRpb25UYXJnZXRHcm91cDtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFY3NGYXJnYXRlQ2x1c3RlclN0YWNrUHJvcHMpIHtcblxuICAgIHN1cGVyKHBhcmVudCwgaWQpO1xuXG4gICAgLyoqXG4gICAgICogMS4gRUNTIENsdXN0ZXJcbiAgICAgKi9cbiAgICB0aGlzLmNsdXN0ZXIgPSBuZXcgQ2x1c3RlcihwYXJlbnQsIGlkICsgXCItQ2x1c3RlclwiLCB7XG4gICAgICB2cGM6IHByb3BzLnZwYyxcbiAgICAgIGNsdXN0ZXJOYW1lOiBwcm9wcy5jbHVzdGVyTmFtZSA/PyBpZCArIFwiLUNsdXN0ZXJcIixcbiAgICAgIGNvbnRhaW5lckluc2lnaHRzOiBwcm9wcy5jb250YWluZXJJbnNpZ2h0cyA/PyB0cnVlXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiAyLiBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlclxuICAgICAqL1xuICAgIHRoaXMuYWxiID0gbmV3IEFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyKFxuICAgICAgcGFyZW50LFxuICAgICAgaWQgKyAnLWFsYicsXG4gICAgICB7XG4gICAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgICAgICBpbnRlcm5ldEZhY2luZzogdHJ1ZSxcbiAgICAgICAgaXBBZGRyZXNzVHlwZTogSXBBZGRyZXNzVHlwZS5JUFY0LFxuICAgICAgICBzZWN1cml0eUdyb3VwOiBwcm9wcy5zZWN1cml0eUdycCxcbiAgICAgICAgdnBjU3VibmV0czogcHJvcHMudnBjLnNlbGVjdFN1Ym5ldHMoe1xuICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICB9KSxcbiAgICAgICAgbG9hZEJhbGFuY2VyTmFtZTogcHJvcHMubG9hZEJhbGFuY2VyTmFtZSA/PyBpZCArICctYWxiJyxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogMy4gQXBwbGljYXRpb24gVGFyZ2V0R3JvdXBcbiAgICAgKi9cbiAgICBjb25zdCB0YXJnZXRHcnAgPSBuZXcgQXBwbGljYXRpb25UYXJnZXRHcm91cChcbiAgICAgIHBhcmVudCxcbiAgICAgIGlkICsgJy1UR3JwJyxcbiAgICAgIHtcbiAgICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgICAgIHByb3RvY29sOiBBcHBsaWNhdGlvblByb3RvY29sLkhUVFAsXG4gICAgICAgIHBvcnQ6IHByb3BzLmFsbG93UG9ydCxcbiAgICAgICAgdGFyZ2V0VHlwZTogVGFyZ2V0VHlwZS5JUCxcbiAgICAgICAgdGFyZ2V0R3JvdXBOYW1lOiBwcm9wcy50YXJnZXRHcm91cE5hbWUgPz8gaWQgKyAnLVRHcnAnLFxuICAgICAgfVxuICAgICk7XG5cbiAgICAvKipcbiAgICAgKiA0LiBBcHBsaWNhdGlvbiBhZGRMaXN0ZW5lclxuICAgICAqL1xuXG4gICAgdGhpcy5sb2FkQmFsYW5jZXJMaXN0ZW5lciA9IHRoaXMuYWxiLmFkZExpc3RlbmVyKFwiTGlzdGVuZXJcIiwge1xuICAgICAgcHJvdG9jb2w6IEFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUCxcbiAgICAgIHBvcnQ6IHByb3BzLmFsbG93UG9ydCxcbiAgICAgIG9wZW46IHRydWUsXG4gICAgICBkZWZhdWx0VGFyZ2V0R3JvdXBzOiBbdGFyZ2V0R3JwXSxcbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIDUuIENsb3VkRm9ybWF0aW9uIE91dHB1dFxuICAgICAqL1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHBhcmVudCwgXCJBcHBsaWNhdGlvbkxvYWRCYWxhbmNlciBETlNcIiwge1xuICAgICAgdmFsdWU6IHRoaXMuYWxiLmxvYWRCYWxhbmNlckRuc05hbWUsXG4gICAgfSk7XG5cbiAgfVxufSJdfQ==