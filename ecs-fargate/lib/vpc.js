"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vpc = void 0;
const cdk = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
/**
 * Creating VPC
 */
class Vpc extends cdk.Construct {
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
exports.Vpc = Vpc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidnBjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyw4Q0FBc0g7QUFvQnRIOztHQUVHO0FBQ0gsTUFBYSxHQUFJLFNBQVEsR0FBRyxDQUFDLFNBQVM7SUFJcEMsWUFBWSxNQUFxQixFQUFFLEVBQVUsRUFBRSxLQUFvQjtRQUNqRSxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWxCLElBQUksS0FBSyxDQUFDLFdBQVcsS0FBSyxHQUFHLEVBQUU7WUFDN0IsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLEdBQUcsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxhQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsTUFBTSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7YUFDeEU7aUJBQU07Z0JBQ0wsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO29CQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsYUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLE1BQU0sRUFBRSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO2lCQUM3RjtxQkFBTTtvQkFDTixJQUFJLENBQUMsR0FBRyxHQUFFLElBQUksYUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsTUFBTSxFQUFFO3dCQUN6QyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7d0JBQ2hCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTt3QkFDcEIsbUJBQW1CLEVBQUU7NEJBQ25CO2dDQUNFLElBQUksRUFBRSxZQUFZO2dDQUNsQixVQUFVLEVBQUUsb0JBQVUsQ0FBQyxNQUFNOzZCQUM5Qjs0QkFDRDtnQ0FDRSxJQUFJLEVBQUUsa0JBQWtCO2dDQUN4QixVQUFVLEVBQUUsb0JBQVUsQ0FBQyxPQUFPOzZCQUMvQjt5QkFDRjt3QkFDRCxnQkFBZ0IsRUFBRTs0QkFDaEIsRUFBRSxFQUFFO2dDQUNGLE9BQU8sRUFBRSxzQ0FBNEIsQ0FBQyxFQUFFOzZCQUN6Qzt5QkFDRjtxQkFDRixDQUFDLENBQUM7aUJBQ0Y7YUFDRjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksYUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsTUFBTSxFQUFFO2dCQUN6QyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQ2hCLE1BQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtnQkFDcEIsbUJBQW1CLEVBQUU7b0JBQ25CO3dCQUNFLElBQUksRUFBRSxZQUFZO3dCQUNsQixVQUFVLEVBQUUsb0JBQVUsQ0FBQyxNQUFNO3FCQUM5QjtvQkFDRDt3QkFDRSxJQUFJLEVBQUUsa0JBQWtCO3dCQUN4QixVQUFVLEVBQUUsb0JBQVUsQ0FBQyxPQUFPO3FCQUMvQjtpQkFDRjtnQkFDRCxnQkFBZ0IsRUFBRTtvQkFDaEIsRUFBRSxFQUFFO3dCQUNGLE9BQU8sRUFBRSxzQ0FBNEIsQ0FBQyxFQUFFO3FCQUN6QztpQkFDRjthQUNGLENBQUMsQ0FBQztTQUNKO1FBRUQscUJBQXFCO1FBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUMvQyxzQkFBc0I7WUFDdEIsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFXLENBQUE7WUFDckQsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxjQUFjLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQyxDQUFDO1FBRUg7O1NBRUM7UUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksdUJBQWEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLGdCQUFnQixFQUFFO1lBQ2xFLGdCQUFnQixFQUFFLElBQUk7WUFDdEIsaUJBQWlCLEVBQUUseUJBQXlCO1lBQzVDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztTQUNkLENBQUMsQ0FBQztRQUVILElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUc7WUFDL0IsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFO2dCQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUM5RDtRQUNILENBQUMsQ0FBQyxDQUFDO0lBR0wsQ0FBQztDQUVGO0FBbkZELGtCQW1GQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xuaW1wb3J0IHtWcGMgYXMgZWMyVnBjLElWcGMsU2VjdXJpdHlHcm91cCxTdWJuZXRUeXBlLEdhdGV3YXlWcGNFbmRwb2ludEF3c1NlcnZpY2UsQ2ZuRUlQLFBvcnR9IGZyb20gXCJAYXdzLWNkay9hd3MtZWMyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVnBjU3RhY2tQcm9wcyBleHRlbmRzIGNkay5TdGFja1Byb3BzIHtcbiAgcmVhZG9ubHkgY2lkcj86IHN0cmluZztcbiAgcmVhZG9ubHkgbWF4QXpzPzogbnVtYmVyO1xuICByZWFkb25seSBuYXRHYXRld2F5cz86IG51bWJlcjtcbiAgcmVhZG9ubHkgcG9ydHM6IG51bWJlcltdO1xuICByZWFkb25seSB0YWdzPzoge1xuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZztcbiAgfTtcblxuICByZWFkb25seSBlbnY6IHtcbiAgICBhY2NvdW50OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgcmVnaW9uOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIH1cbiAgcmVhZG9ubHkgdnBjSWQ6IHN0cmluZztcbiAgcmVhZG9ubHkgdXNlRGVmYXVsdFZwYzogc3RyaW5nO1xuICByZWFkb25seSB1c2VFeGlzdFZwYzogc3RyaW5nO1xufVxuXG4vKiogXG4gKiBDcmVhdGluZyBWUENcbiAqL1xuZXhwb3J0IGNsYXNzIFZwYyBleHRlbmRzIGNkay5Db25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgdnBjOiBJVnBjO1xuICByZWFkb25seSBzZWN1cml0eUdycDogU2VjdXJpdHlHcm91cDtcblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBWcGNTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIocGFyZW50LCBpZCk7XG5cbiAgICBpZiAocHJvcHMudXNlRXhpc3RWcGMgPT09ICcxJykge1xuICAgICAgaWYgKHByb3BzLnVzZURlZmF1bHRWcGMgPT09ICcxJykge1xuICAgICAgICB0aGlzLnZwYyA9IGVjMlZwYy5mcm9tTG9va3VwKHBhcmVudCwgaWQgKyAnLVZQQycsIHsgaXNEZWZhdWx0OiB0cnVlIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHByb3BzLnZwY0lkKSB7XG4gICAgICAgICAgdGhpcy52cGMgPSBlYzJWcGMuZnJvbUxvb2t1cChwYXJlbnQsIGlkICsgJy1WUEMnLCB7IGlzRGVmYXVsdDogZmFsc2UsIHZwY0lkOiBwcm9wcy52cGNJZCB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgIHRoaXMudnBjPSBuZXcgZWMyVnBjKHBhcmVudCwgaWQgKyAnLVZQQycsIHtcbiAgICAgICAgICBjaWRyOiBwcm9wcy5jaWRyLFxuICAgICAgICAgIG1heEF6czogcHJvcHMubWF4QXpzLFxuICAgICAgICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTogJ1B1YmxpYy1ETVonLFxuICAgICAgICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBVQkxJQyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6ICdQcml2YXRlLVNlcnZpY2VzJyxcbiAgICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIGdhdGV3YXlFbmRwb2ludHM6IHtcbiAgICAgICAgICAgIFMzOiB7XG4gICAgICAgICAgICAgIHNlcnZpY2U6IEdhdGV3YXlWcGNFbmRwb2ludEF3c1NlcnZpY2UuUzMsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICB9IFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZwYyA9IG5ldyBlYzJWcGMocGFyZW50LCBpZCArICctVlBDJywge1xuICAgICAgICBjaWRyOiBwcm9wcy5jaWRyLFxuICAgICAgICBtYXhBenM6IHByb3BzLm1heEF6cyxcbiAgICAgICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWU6ICdQdWJsaWMtRE1aJyxcbiAgICAgICAgICAgIHN1Ym5ldFR5cGU6IFN1Ym5ldFR5cGUuUFVCTElDLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZTogJ1ByaXZhdGUtU2VydmljZXMnLFxuICAgICAgICAgICAgc3VibmV0VHlwZTogU3VibmV0VHlwZS5QUklWQVRFLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGdhdGV3YXlFbmRwb2ludHM6IHtcbiAgICAgICAgICBTMzoge1xuICAgICAgICAgICAgc2VydmljZTogR2F0ZXdheVZwY0VuZHBvaW50QXdzU2VydmljZS5TMyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqIEdldCBFbGFzdGljIElQICovXG4gICAgdGhpcy52cGMucHVibGljU3VibmV0cy5mb3JFYWNoKChzdWJuZXQsIGluZGV4KSA9PiB7XG4gICAgICAvLyBGaW5kIHRoZSBFbGFzdGljIElQXG4gICAgICBjb25zdCBFSVAgPSBzdWJuZXQubm9kZS50cnlGaW5kQ2hpbGQoJ0VJUCcpIGFzIENmbkVJUFxuICAgICAgbmV3IGNkay5DZm5PdXRwdXQocGFyZW50LCBgb3V0cHV0LWVpcC0ke2luZGV4fWAsIHsgdmFsdWU6IEVJUC5yZWYgfSk7XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICogU2VjdXJpdHkgR3JvdXBcbiAgICovXG4gICAgdGhpcy5zZWN1cml0eUdycCA9IG5ldyBTZWN1cml0eUdyb3VwKHBhcmVudCwgaWQgKyAnLVNlY3VyaXR5R3JvdXAnLCB7XG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxuICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdIdHRwUHVibGljU2VjdXJpdHlHcm91cCcsXG4gICAgICB2cGM6IHRoaXMudnBjLCBcbiAgICB9KTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBwcm9wcy5wb3J0cy5mb3JFYWNoKGZ1bmN0aW9uICh2YWwpIHsgXG4gICAgICBpZiAodmFsICE9IDApIHtcbiAgICAgICAgc2VsZi5zZWN1cml0eUdycC5jb25uZWN0aW9ucy5hbGxvd0Zyb21BbnlJcHY0KFBvcnQudGNwKHZhbCkpO1xuICAgICAgfVxuICAgIH0pO1xuXG5cbiAgfVxuIFxufVxuIl19