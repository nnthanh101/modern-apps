"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcsFargateClusterStack = void 0;
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const elb2 = require("@aws-cdk/aws-elasticloadbalancingv2");
const ecs = require("@aws-cdk/aws-ecs");
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
        this.cluster = new ecs.Cluster(parent, id + "-Cluster", {
            vpc: props.vpc,
            clusterName: (_a = props.clusterName) !== null && _a !== void 0 ? _a : id + "-Cluster",
            containerInsights: (_b = props.containerInsights) !== null && _b !== void 0 ? _b : true
        });
        /**
         * 2. ApplicationLoadBalancer
         */
        this.alb = new elb2.ApplicationLoadBalancer(parent, id + '-alb', {
            vpc: props.vpc,
            internetFacing: true,
            ipAddressType: elb2.IpAddressType.IPV4,
            securityGroup: props.securityGrp,
            vpcSubnets: props.vpc.selectSubnets({
                subnetType: ec2.SubnetType.PUBLIC,
            }),
            loadBalancerName: (_c = props.loadBalancerName) !== null && _c !== void 0 ? _c : id + '-alb',
        });
        /**
         * 3. Application TargetGroup
         */
        const targetGrp = new elb2.ApplicationTargetGroup(parent, id + '-TGrp', {
            vpc: props.vpc,
            protocol: elb2.ApplicationProtocol.HTTP,
            port: props.allowPort,
            targetType: elb2.TargetType.IP,
            targetGroupName: (_d = props.targetGroupName) !== null && _d !== void 0 ? _d : id + '-TGrp',
        });
        /**
         * 4. Application addListener
         */
        this.loadBalancerListener = this.alb.addListener("Listener", {
            protocol: elb2.ApplicationProtocol.HTTP,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzLWZhcmdhdGUtY2x1c3Rlci1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjcy1mYXJnYXRlLWNsdXN0ZXItc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLHdDQUF3QztBQUN4Qyw0REFBNEQ7QUFDNUQsd0NBQXdDO0FBcUJ4Qzs7O0dBR0c7QUFDSCxNQUFhLHNCQUF1QixTQUFRLEdBQUcsQ0FBQyxTQUFTO0lBT3ZELFlBQVksTUFBcUIsRUFBRSxFQUFVLEVBQUUsS0FBa0M7O1FBRS9FLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFFLENBQUM7UUFFbkI7O1dBRUc7UUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLFVBQVUsRUFBRTtZQUN0RCxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxXQUFXLFFBQUUsS0FBSyxDQUFDLFdBQVcsbUNBQUksRUFBRSxHQUFHLFVBQVU7WUFDakQsaUJBQWlCLFFBQUUsS0FBSyxDQUFDLGlCQUFpQixtQ0FBSSxJQUFJO1NBQ25ELENBQUMsQ0FBQztRQUVIOztXQUVHO1FBQ0gsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FDdkMsTUFBTSxFQUNSLEVBQUUsR0FBRyxNQUFNLEVBQ1g7WUFDRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxjQUFjLEVBQUUsSUFBSTtZQUNwQixhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJO1lBQ3RDLGFBQWEsRUFBRSxLQUFLLENBQUMsV0FBVztZQUNoQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7Z0JBQ2xDLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU07YUFDbEMsQ0FBQztZQUNGLGdCQUFnQixRQUFFLEtBQUssQ0FBQyxnQkFBZ0IsbUNBQUksRUFBRSxHQUFHLE1BQU07U0FDeEQsQ0FDRixDQUFDO1FBRUY7O1dBRUc7UUFDSCxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxzQkFBc0IsQ0FDN0MsTUFBTSxFQUNSLEVBQUUsR0FBRyxPQUFPLEVBQ1o7WUFDRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxRQUFRLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUk7WUFDdkMsSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQ3JCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDOUIsZUFBZSxRQUFFLEtBQUssQ0FBQyxlQUFlLG1DQUFJLEVBQUUsR0FBRyxPQUFPO1NBQ3ZELENBQ0YsQ0FBQztRQUVGOztXQUVHO1FBRUgsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsRUFBRTtZQUMzRCxRQUFRLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUk7WUFDdkMsSUFBSSxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQ3JCLElBQUksRUFBRSxJQUFJO1lBQ1YsbUJBQW1CLEVBQUUsQ0FBQyxTQUFTLENBQUM7U0FDakMsQ0FBQyxDQUFDO1FBRUg7O1dBRUc7UUFDSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLDZCQUE2QixFQUFFO1lBQ3ZELEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQjtTQUNwQyxDQUFDLENBQUM7SUFFTCxDQUFDO0NBQ0Y7QUF4RUQsd0RBd0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSBcIkBhd3MtY2RrL2F3cy1lYzJcIjtcbmltcG9ydCAqIGFzIGVsYjIgZnJvbSBcIkBhd3MtY2RrL2F3cy1lbGFzdGljbG9hZGJhbGFuY2luZ3YyXCI7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSBcIkBhd3MtY2RrL2F3cy1lY3NcIjtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gZWNzLkNsdXN0ZXJQcm9wcyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2FwaS9sYXRlc3QvdHlwZXNjcmlwdC9hcGkvYXdzLWVjcy9jbHVzdGVycHJvcHMuaHRtbCNhd3NfZWNzX0NsdXN0ZXJQcm9wc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEVjc0ZhcmdhdGVDbHVzdGVyU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgcmVhZG9ubHkgdnBjOiBlYzIuSVZwYztcbiAgcmVhZG9ubHkgY2x1c3Rlck5hbWU/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGNvbnRhaW5lckluc2lnaHRzPzogYm9vbGVhbjtcblxuICByZWFkb25seSBsb2FkQmFsYW5jZXJOYW1lPzogc3RyaW5nO1xuICByZWFkb25seSBzZWN1cml0eUdycDogZWMyLlNlY3VyaXR5R3JvdXA7XG4gIFxuICByZWFkb25seSB0YXJnZXRHcm91cE5hbWU/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IGFsbG93UG9ydDogbnVtYmVyO1xuXG4gIHJlYWRvbmx5IHRhZ3M/OiB7XG4gICAgW2tleTogc3RyaW5nXTogc3RyaW5nO1xuICB9O1xufVxuXG4vKipcbiAqIFZQQyA+PiBFQ1MgQ2x1c3RlclxuICogU2hhcmVkIExvYWQgQmFsYW5jZXI6IGNyZWF0ZSBhbiBlbXB0eSBUYXJnZXRHcm91cCBpbiB0aGUgU2hhcmVkIEFMQiwgYW5kIHJlZ2lzdGVyIGEgU2VydmljZSBpbnRvIGl0IGluIHRoZSBTZXJ2aWNlU3RhY2suXG4gKi9cbmV4cG9ydCBjbGFzcyBFY3NGYXJnYXRlQ2x1c3RlclN0YWNrIGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG4gIHJlYWRvbmx5IGNsdXN0ZXI6IGVjcy5DbHVzdGVyO1xuICByZWFkb25seSBhbGI6IGVsYjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXI7XG4gIHJlYWRvbmx5IGZnc2VydmljZTogZWNzLkZhcmdhdGVTZXJ2aWNlO1xuICByZWFkb25seSBsb2FkQmFsYW5jZXJMaXN0ZW5lcjogZWxiMi5BcHBsaWNhdGlvbkxpc3RlbmVyO1xuICBwdWJsaWMgcmVhZG9ubHkgdGFyZ2V0R3JvdXA6IGVsYjIuQXBwbGljYXRpb25UYXJnZXRHcm91cDtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBFY3NGYXJnYXRlQ2x1c3RlclN0YWNrUHJvcHMpIHtcbiAgICBcbiAgICBzdXBlcihwYXJlbnQsIGlkICk7XG4gICAgICBcbiAgICAvKipcbiAgICAgKiAxLiBFQ1MgQ2x1c3RlclxuICAgICAqL1xuICAgIHRoaXMuY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihwYXJlbnQsIGlkICsgXCItQ2x1c3RlclwiLCB7XG4gICAgICB2cGM6IHByb3BzLnZwYyxcbiAgICAgIGNsdXN0ZXJOYW1lOiBwcm9wcy5jbHVzdGVyTmFtZSA/PyBpZCArIFwiLUNsdXN0ZXJcIixcbiAgICAgIGNvbnRhaW5lckluc2lnaHRzOiBwcm9wcy5jb250YWluZXJJbnNpZ2h0cyA/PyB0cnVlXG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiAyLiBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlclxuICAgICAqL1xuICAgIHRoaXMuYWxiID0gbmV3IGVsYjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIoXG4gICAgICAgIHBhcmVudCxcbiAgICAgIGlkICsgJy1hbGInLFxuICAgICAge1xuICAgICAgICB2cGM6IHByb3BzLnZwYywgXG4gICAgICAgIGludGVybmV0RmFjaW5nOiB0cnVlLFxuICAgICAgICBpcEFkZHJlc3NUeXBlOiBlbGIyLklwQWRkcmVzc1R5cGUuSVBWNCxcbiAgICAgICAgc2VjdXJpdHlHcm91cDogcHJvcHMuc2VjdXJpdHlHcnAsXG4gICAgICAgIHZwY1N1Ym5ldHM6IHByb3BzLnZwYy5zZWxlY3RTdWJuZXRzKHtcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgIH0pLFxuICAgICAgICBsb2FkQmFsYW5jZXJOYW1lOiBwcm9wcy5sb2FkQmFsYW5jZXJOYW1lID8/IGlkICsgJy1hbGInLFxuICAgICAgfVxuICAgICk7XG5cbiAgICAvKipcbiAgICAgKiAzLiBBcHBsaWNhdGlvbiBUYXJnZXRHcm91cFxuICAgICAqL1xuICAgIGNvbnN0IHRhcmdldEdycCA9IG5ldyBlbGIyLkFwcGxpY2F0aW9uVGFyZ2V0R3JvdXAoXG4gICAgICAgIHBhcmVudCxcbiAgICAgIGlkICsgJy1UR3JwJyxcbiAgICAgIHtcbiAgICAgICAgdnBjOiBwcm9wcy52cGMsXG4gICAgICAgIHByb3RvY29sOiBlbGIyLkFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUCxcbiAgICAgICAgcG9ydDogcHJvcHMuYWxsb3dQb3J0LFxuICAgICAgICB0YXJnZXRUeXBlOiBlbGIyLlRhcmdldFR5cGUuSVAsXG4gICAgICAgIHRhcmdldEdyb3VwTmFtZTogcHJvcHMudGFyZ2V0R3JvdXBOYW1lID8/IGlkICsgJy1UR3JwJyxcbiAgICAgIH1cbiAgICApO1xuXG4gICAgLyoqXG4gICAgICogNC4gQXBwbGljYXRpb24gYWRkTGlzdGVuZXJcbiAgICAgKi9cbiAgICBcbiAgICB0aGlzLmxvYWRCYWxhbmNlckxpc3RlbmVyID0gdGhpcy5hbGIuYWRkTGlzdGVuZXIoXCJMaXN0ZW5lclwiLCB7XG4gICAgICBwcm90b2NvbDogZWxiMi5BcHBsaWNhdGlvblByb3RvY29sLkhUVFAsXG4gICAgICBwb3J0OiBwcm9wcy5hbGxvd1BvcnQsXG4gICAgICBvcGVuOiB0cnVlLFxuICAgICAgZGVmYXVsdFRhcmdldEdyb3VwczogW3RhcmdldEdycF0sXG4gICAgfSk7XG4gICAgXG4gICAgLyoqXG4gICAgICogNS4gQ2xvdWRGb3JtYXRpb24gT3V0cHV0XG4gICAgICovXG4gICAgbmV3IGNkay5DZm5PdXRwdXQocGFyZW50LCBcIkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VyIEROU1wiLCB7XG4gICAgICB2YWx1ZTogdGhpcy5hbGIubG9hZEJhbGFuY2VyRG5zTmFtZSxcbiAgICB9KTtcblxuICB9XG59Il19