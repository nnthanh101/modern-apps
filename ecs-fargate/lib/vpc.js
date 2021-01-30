"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vpc = void 0;
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
/**
 * Creating VPC
 */
class Vpc extends cdk.Construct {
    constructor(parent, id, props) {
        super(parent, id);
        if (props.useExistVpc === '1') {
            if (props.useDefaultVpc === '1') {
                this.vpc = ec2.Vpc.fromLookup(parent, id + '-VPC', { isDefault: true });
            }
            else {
                if (props.vpcId) {
                    this.vpc = ec2.Vpc.fromLookup(parent, id + '-VPC', { isDefault: false, vpcId: props.vpcId });
                }
                else {
                    this.vpc = this.createNewVpc(parent, props, id);
                }
            }
        }
        else {
            this.vpc = this.createNewVpc(parent, props, id);
        }
        /** Get Elastic IP */
        this.vpc.publicSubnets.forEach((subnet, index) => {
            // Find the Elastic IP
            const EIP = subnet.node.tryFindChild('EIP');
            new cdk.CfnOutput(parent, `output-eip-${index}`, { value: EIP.ref });
        });
        /**
       * Security Group
       */
        this.securityGrp = new ec2.SecurityGroup(parent, id + '-SecurityGroup', {
            allowAllOutbound: true,
            securityGroupName: 'HttpPublicSecurityGroup',
            vpc: this.vpc,
        });
        var self = this;
        props.ports.forEach(function (val) {
            if (val != 0) {
                self.securityGrp.connections.allowFromAnyIpv4(ec2.Port.tcp(val));
            }
        });
    }
    createNewVpc(parent, props, id) {
        return new ec2.Vpc(parent, id + '-VPC', {
            cidr: props.cidr,
            maxAzs: props.maxAzs,
            subnetConfiguration: [
                {
                    name: 'Public-DMZ',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
                {
                    name: 'Private-Services',
                    subnetType: ec2.SubnetType.PRIVATE,
                },
            ],
            gatewayEndpoints: {
                S3: {
                    service: ec2.GatewayVpcEndpointAwsService.S3,
                },
            },
        });
    }
}
exports.Vpc = Vpc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidnBjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFzQztBQUN0Qyx3Q0FBd0M7QUFvQnhDOztHQUVHO0FBQ0gsTUFBYSxHQUFJLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFJcEMsWUFBWSxNQUFxQixFQUFFLEVBQVUsRUFBRSxLQUFlO1FBRTVELEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFFLENBQUM7UUFFbkIsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLEdBQUcsRUFBRTtZQUM3QixJQUFJLEtBQUssQ0FBQyxhQUFhLEtBQUssR0FBRyxFQUFFO2dCQUMvQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsTUFBTSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7YUFDekU7aUJBQU07Z0JBQ0wsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO29CQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxNQUFNLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztpQkFDOUY7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7aUJBQ2hEO2FBQ0Y7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7U0FDaEQ7UUFFRCxxQkFBcUI7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQy9DLHNCQUFzQjtZQUN0QixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQWUsQ0FBQTtZQUN6RCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLGNBQWMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDLENBQUM7UUFFSDs7U0FFQztRQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsZ0JBQWdCLEVBQUU7WUFDdEUsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixpQkFBaUIsRUFBRSx5QkFBeUI7WUFDNUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ2QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVMsR0FBRztZQUM5QixJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUNsRTtRQUNILENBQUMsQ0FBQyxDQUFDO0lBR0wsQ0FBQztJQUVPLFlBQVksQ0FBQyxNQUFvQixFQUFFLEtBQWUsRUFBRSxFQUFVO1FBQ3BFLE9BQU8sSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsTUFBTSxFQUFFO1lBQ3RDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixNQUFNLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDcEIsbUJBQW1CLEVBQUU7Z0JBQ25CO29CQUNFLElBQUksRUFBRSxZQUFZO29CQUNsQixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNO2lCQUNsQztnQkFDRDtvQkFDRSxJQUFJLEVBQUUsa0JBQWtCO29CQUN4QixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPO2lCQUNuQzthQUNGO1lBQ0QsZ0JBQWdCLEVBQUU7Z0JBQ2hCLEVBQUUsRUFBRTtvQkFDRixPQUFPLEVBQUUsR0FBRyxDQUFDLDRCQUE0QixDQUFDLEVBQUU7aUJBQzdDO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFyRUQsa0JBcUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNkayA9IHJlcXVpcmUoXCJAYXdzLWNkay9jb3JlXCIpO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gXCJAYXdzLWNkay9hd3MtZWMyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVnBjUHJvcHMge1xuICByZWFkb25seSBjaWRyPzogc3RyaW5nO1xuICByZWFkb25seSBtYXhBenM/OiBudW1iZXI7XG4gIHJlYWRvbmx5IG5hdEdhdGV3YXlzPzogbnVtYmVyO1xuICByZWFkb25seSBwb3J0czogbnVtYmVyW107XG4gIHJlYWRvbmx5IHRhZ3M/OiB7XG4gICAgW2tleTogc3RyaW5nXTogc3RyaW5nO1xuICB9O1xuXG4gIHJlYWRvbmx5IGVudjoge1xuICAgIGFjY291bnQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICByZWdpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgfVxuICByZWFkb25seSB2cGNJZDogc3RyaW5nO1xuICByZWFkb25seSB1c2VEZWZhdWx0VnBjOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHVzZUV4aXN0VnBjOiBzdHJpbmc7XG59XG5cbi8qKiBcbiAqIENyZWF0aW5nIFZQQ1xuICovXG5leHBvcnQgY2xhc3MgVnBjIGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSB2cGM6IGVjMi5JVnBjOyBcbiAgcmVhZG9ubHkgc2VjdXJpdHlHcnA6IGVjMi5TZWN1cml0eUdyb3VwO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFZwY1Byb3BzKSB7XG5cbiAgICBzdXBlcihwYXJlbnQsIGlkICk7XG5cbiAgICBpZiAocHJvcHMudXNlRXhpc3RWcGMgPT09ICcxJykge1xuICAgICAgaWYgKHByb3BzLnVzZURlZmF1bHRWcGMgPT09ICcxJykge1xuICAgICAgICB0aGlzLnZwYyA9IGVjMi5WcGMuZnJvbUxvb2t1cChwYXJlbnQsIGlkICsgJy1WUEMnLCB7IGlzRGVmYXVsdDogdHJ1ZSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwcm9wcy52cGNJZCkge1xuICAgICAgICAgIHRoaXMudnBjID0gZWMyLlZwYy5mcm9tTG9va3VwKHBhcmVudCwgaWQgKyAnLVZQQycsIHsgaXNEZWZhdWx0OiBmYWxzZSwgdnBjSWQ6IHByb3BzLnZwY0lkIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudnBjID0gdGhpcy5jcmVhdGVOZXdWcGMocGFyZW50LHByb3BzLCBpZCk7XG4gICAgICAgIH1cbiAgICAgIH0gXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudnBjID0gdGhpcy5jcmVhdGVOZXdWcGMocGFyZW50LHByb3BzLCBpZCk7XG4gICAgfVxuXG4gICAgLyoqIEdldCBFbGFzdGljIElQICovXG4gICAgdGhpcy52cGMucHVibGljU3VibmV0cy5mb3JFYWNoKChzdWJuZXQsIGluZGV4KSA9PiB7XG4gICAgICAvLyBGaW5kIHRoZSBFbGFzdGljIElQXG4gICAgICBjb25zdCBFSVAgPSBzdWJuZXQubm9kZS50cnlGaW5kQ2hpbGQoJ0VJUCcpIGFzIGVjMi5DZm5FSVBcbiAgICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHBhcmVudCwgYG91dHB1dC1laXAtJHtpbmRleH1gLCB7IHZhbHVlOiBFSVAucmVmIH0pO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAqIFNlY3VyaXR5IEdyb3VwXG4gICAqL1xuICAgIHRoaXMuc2VjdXJpdHlHcnAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAocGFyZW50LCBpZCArICctU2VjdXJpdHlHcm91cCcsIHtcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXG4gICAgICBzZWN1cml0eUdyb3VwTmFtZTogJ0h0dHBQdWJsaWNTZWN1cml0eUdyb3VwJyxcbiAgICAgIHZwYzogdGhpcy52cGMsXG4gICAgfSk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcHJvcHMucG9ydHMuZm9yRWFjaChmdW5jdGlvbih2YWwpe1xuICAgICAgaWYgKHZhbCAhPSAwKSB7XG4gICAgICAgIHNlbGYuc2VjdXJpdHlHcnAuY29ubmVjdGlvbnMuYWxsb3dGcm9tQW55SXB2NChlYzIuUG9ydC50Y3AodmFsKSk7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVOZXdWcGMocGFyZW50OmNkay5Db25zdHJ1Y3QsIHByb3BzOiBWcGNQcm9wcywgaWQ6IHN0cmluZyk6IGVjMi5JVnBjIHtcbiAgICByZXR1cm4gbmV3IGVjMi5WcGMocGFyZW50LCBpZCArICctVlBDJywge1xuICAgICAgY2lkcjogcHJvcHMuY2lkciAgLFxuICAgICAgbWF4QXpzOiBwcm9wcy5tYXhBenMgICxcbiAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6ICdQdWJsaWMtRE1aJywgXG4gICAgICAgICAgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogJ1ByaXZhdGUtU2VydmljZXMnLCBcbiAgICAgICAgICBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIGdhdGV3YXlFbmRwb2ludHM6IHtcbiAgICAgICAgUzM6IHtcbiAgICAgICAgICBzZXJ2aWNlOiBlYzIuR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZS5TMyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==