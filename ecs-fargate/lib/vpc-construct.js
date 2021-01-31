"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpcConstruct = void 0;
const cdk = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
/**
 * Creating VPC
 */
class VpcConstruct extends cdk.Construct {
    constructor(parent, id, props) {
        super(parent, id);
        if (props.useExistVpc === '1') {
            if (props.useDefaultVpc === '1') {
                this.vpc = aws_ec2_1.Vpc.fromLookup(parent, id + '-VPC', { isDefault: true });
            }
            else {
                if (props.vpcId) {
                    this.vpc = aws_ec2_1.Vpc.fromLookup(parent, id + '-VPC', { isDefault: false, vpcId: props.vpcId });
                }
                else {
                    this.vpc = new aws_ec2_1.Vpc(parent, id + '-VPC', {
                        cidr: props.cidr,
                        maxAzs: props.maxAzs,
                        subnetConfiguration: [
                            {
                                name: 'Public-DMZ',
                                subnetType: aws_ec2_1.SubnetType.PUBLIC,
                            },
                            {
                                name: 'Private-Services',
                                subnetType: aws_ec2_1.SubnetType.PRIVATE,
                            },
                        ],
                        gatewayEndpoints: {
                            S3: {
                                service: aws_ec2_1.GatewayVpcEndpointAwsService.S3,
                            },
                        },
                    });
                }
            }
        }
        else {
            this.vpc = new aws_ec2_1.Vpc(parent, id + '-VPC', {
                cidr: props.cidr,
                maxAzs: props.maxAzs,
                subnetConfiguration: [
                    {
                        name: 'Public-DMZ',
                        subnetType: aws_ec2_1.SubnetType.PUBLIC,
                    },
                    {
                        name: 'Private-Services',
                        subnetType: aws_ec2_1.SubnetType.PRIVATE,
                    },
                ],
                gatewayEndpoints: {
                    S3: {
                        service: aws_ec2_1.GatewayVpcEndpointAwsService.S3,
                    },
                },
            });
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
        this.securityGrp = new aws_ec2_1.SecurityGroup(parent, id + '-SecurityGroup', {
            allowAllOutbound: true,
            securityGroupName: 'HttpPublicSecurityGroup',
            vpc: this.vpc,
        });
        var self = this;
        props.ports.forEach(function (val) {
            if (val != 0) {
                self.securityGrp.connections.allowFromAnyIpv4(aws_ec2_1.Port.tcp(val));
            }
        });
    }
}
exports.VpcConstruct = VpcConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZwYy1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLDhDQUE2RztBQW9CN0c7O0dBRUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxHQUFHLENBQUMsU0FBUztJQUk3QyxZQUFZLE1BQXFCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQ2pFLEtBQUssQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFbEIsSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLEdBQUcsRUFBRTtZQUM3QixJQUFJLEtBQUssQ0FBQyxhQUFhLEtBQUssR0FBRyxFQUFFO2dCQUMvQixJQUFJLENBQUMsR0FBRyxHQUFHLGFBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxNQUFNLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQzthQUNyRTtpQkFBTTtnQkFDTCxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxhQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsTUFBTSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7aUJBQzFGO3FCQUFNO29CQUNOLElBQUksQ0FBQyxHQUFHLEdBQUUsSUFBSSxhQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxNQUFNLEVBQUU7d0JBQ3RDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTt3QkFDaEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO3dCQUNwQixtQkFBbUIsRUFBRTs0QkFDbkI7Z0NBQ0UsSUFBSSxFQUFFLFlBQVk7Z0NBQ2xCLFVBQVUsRUFBRSxvQkFBVSxDQUFDLE1BQU07NkJBQzlCOzRCQUNEO2dDQUNFLElBQUksRUFBRSxrQkFBa0I7Z0NBQ3hCLFVBQVUsRUFBRSxvQkFBVSxDQUFDLE9BQU87NkJBQy9CO3lCQUNGO3dCQUNELGdCQUFnQixFQUFFOzRCQUNoQixFQUFFLEVBQUU7Z0NBQ0YsT0FBTyxFQUFFLHNDQUE0QixDQUFDLEVBQUU7NkJBQ3pDO3lCQUNGO3FCQUNGLENBQUMsQ0FBQztpQkFDRjthQUNGO1NBQ0Y7YUFBTTtZQUNMLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxhQUFHLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxNQUFNLEVBQUU7Z0JBQ3RDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtnQkFDaEIsTUFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO2dCQUNwQixtQkFBbUIsRUFBRTtvQkFDbkI7d0JBQ0UsSUFBSSxFQUFFLFlBQVk7d0JBQ2xCLFVBQVUsRUFBRSxvQkFBVSxDQUFDLE1BQU07cUJBQzlCO29CQUNEO3dCQUNFLElBQUksRUFBRSxrQkFBa0I7d0JBQ3hCLFVBQVUsRUFBRSxvQkFBVSxDQUFDLE9BQU87cUJBQy9CO2lCQUNGO2dCQUNELGdCQUFnQixFQUFFO29CQUNoQixFQUFFLEVBQUU7d0JBQ0YsT0FBTyxFQUFFLHNDQUE0QixDQUFDLEVBQUU7cUJBQ3pDO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxxQkFBcUI7UUFDckIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQy9DLHNCQUFzQjtZQUN0QixNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQVcsQ0FBQTtZQUNyRCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLGNBQWMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdkUsQ0FBQyxDQUFDLENBQUM7UUFFSDs7U0FFQztRQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSx1QkFBYSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsZ0JBQWdCLEVBQUU7WUFDbEUsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixpQkFBaUIsRUFBRSx5QkFBeUI7WUFDNUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1NBQ2QsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRztZQUMvQixJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsY0FBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzlEO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFHTCxDQUFDO0NBRUY7QUFuRkQsb0NBbUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gXCJAYXdzLWNkay9jb3JlXCI7XG5pbXBvcnQge1ZwYyAsSVZwYyxTZWN1cml0eUdyb3VwLFN1Ym5ldFR5cGUsR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZSxDZm5FSVAsUG9ydH0gZnJvbSBcIkBhd3MtY2RrL2F3cy1lYzJcIjtcblxuZXhwb3J0IGludGVyZmFjZSBWcGNTdGFja1Byb3BzIGV4dGVuZHMgY2RrLlN0YWNrUHJvcHMge1xuICByZWFkb25seSBjaWRyPzogc3RyaW5nO1xuICByZWFkb25seSBtYXhBenM/OiBudW1iZXI7XG4gIHJlYWRvbmx5IG5hdEdhdGV3YXlzPzogbnVtYmVyO1xuICByZWFkb25seSBwb3J0czogbnVtYmVyW107XG4gIHJlYWRvbmx5IHRhZ3M/OiB7XG4gICAgW2tleTogc3RyaW5nXTogc3RyaW5nO1xuICB9O1xuXG4gIHJlYWRvbmx5IGVudjoge1xuICAgIGFjY291bnQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICByZWdpb246IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgfVxuICByZWFkb25seSB2cGNJZDogc3RyaW5nO1xuICByZWFkb25seSB1c2VEZWZhdWx0VnBjOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHVzZUV4aXN0VnBjOiBzdHJpbmc7XG59XG5cbi8qKiBcbiAqIENyZWF0aW5nIFZQQ1xuICovXG5leHBvcnQgY2xhc3MgVnBjQ29uc3RydWN0IGV4dGVuZHMgY2RrLkNvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSB2cGM6IElWcGM7XG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JwOiBTZWN1cml0eUdyb3VwO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFZwY1N0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihwYXJlbnQsIGlkKTtcblxuICAgIGlmIChwcm9wcy51c2VFeGlzdFZwYyA9PT0gJzEnKSB7XG4gICAgICBpZiAocHJvcHMudXNlRGVmYXVsdFZwYyA9PT0gJzEnKSB7XG4gICAgICAgIHRoaXMudnBjID0gVnBjLmZyb21Mb29rdXAocGFyZW50LCBpZCArICctVlBDJywgeyBpc0RlZmF1bHQ6IHRydWUgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocHJvcHMudnBjSWQpIHtcbiAgICAgICAgICB0aGlzLnZwYyA9IFZwYy5mcm9tTG9va3VwKHBhcmVudCwgaWQgKyAnLVZQQycsIHsgaXNEZWZhdWx0OiBmYWxzZSwgdnBjSWQ6IHByb3BzLnZwY0lkIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgdGhpcy52cGM9IG5ldyBWcGMocGFyZW50LCBpZCArICctVlBDJywge1xuICAgICAgICAgIGNpZHI6IHByb3BzLmNpZHIsXG4gICAgICAgICAgbWF4QXpzOiBwcm9wcy5tYXhBenMsXG4gICAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBuYW1lOiAnUHVibGljLURNWicsXG4gICAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ1ByaXZhdGUtU2VydmljZXMnLFxuICAgICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgZ2F0ZXdheUVuZHBvaW50czoge1xuICAgICAgICAgICAgUzM6IHtcbiAgICAgICAgICAgICAgc2VydmljZTogR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZS5TMyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIH0gXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudnBjID0gbmV3IFZwYyhwYXJlbnQsIGlkICsgJy1WUEMnLCB7XG4gICAgICAgIGNpZHI6IHByb3BzLmNpZHIsXG4gICAgICAgIG1heEF6czogcHJvcHMubWF4QXpzLFxuICAgICAgICBzdWJuZXRDb25maWd1cmF0aW9uOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1B1YmxpYy1ETVonLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QVUJMSUMsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lOiAnUHJpdmF0ZS1TZXJ2aWNlcycsXG4gICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEUsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgZ2F0ZXdheUVuZHBvaW50czoge1xuICAgICAgICAgIFMzOiB7XG4gICAgICAgICAgICBzZXJ2aWNlOiBHYXRld2F5VnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlMzLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvKiogR2V0IEVsYXN0aWMgSVAgKi9cbiAgICB0aGlzLnZwYy5wdWJsaWNTdWJuZXRzLmZvckVhY2goKHN1Ym5ldCwgaW5kZXgpID0+IHtcbiAgICAgIC8vIEZpbmQgdGhlIEVsYXN0aWMgSVBcbiAgICAgIGNvbnN0IEVJUCA9IHN1Ym5ldC5ub2RlLnRyeUZpbmRDaGlsZCgnRUlQJykgYXMgQ2ZuRUlQXG4gICAgICBuZXcgY2RrLkNmbk91dHB1dChwYXJlbnQsIGBvdXRwdXQtZWlwLSR7aW5kZXh9YCwgeyB2YWx1ZTogRUlQLnJlZiB9KTtcbiAgICB9KTtcblxuICAgIC8qKlxuICAgKiBTZWN1cml0eSBHcm91cFxuICAgKi9cbiAgICB0aGlzLnNlY3VyaXR5R3JwID0gbmV3IFNlY3VyaXR5R3JvdXAocGFyZW50LCBpZCArICctU2VjdXJpdHlHcm91cCcsIHtcbiAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXG4gICAgICBzZWN1cml0eUdyb3VwTmFtZTogJ0h0dHBQdWJsaWNTZWN1cml0eUdyb3VwJyxcbiAgICAgIHZwYzogdGhpcy52cGMsIFxuICAgIH0pO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHByb3BzLnBvcnRzLmZvckVhY2goZnVuY3Rpb24gKHZhbCkgeyBcbiAgICAgIGlmICh2YWwgIT0gMCkge1xuICAgICAgICBzZWxmLnNlY3VyaXR5R3JwLmNvbm5lY3Rpb25zLmFsbG93RnJvbUFueUlwdjQoUG9ydC50Y3AodmFsKSk7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICB9XG4gXG59XG4iXX0=