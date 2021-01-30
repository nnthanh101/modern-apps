"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationMetaData = void 0;
//configuration file
exports.applicationMetaData = {
    applicationAccount: "${AWS_ACCOUNT}",
    region: "${AWS_REGION}",
    /** VPC Config*/
    vpcStackName: "ECS-VPC-Stack",
    useExistVpc: "0",
    vpcId: "vpc-123123",
    useDefaultVpc: "0",
    maxAzs: 2,
    cidr: "10.0.0.0/18",
    publicPort: [80, 443, 3036],
    /** ECS Config*/
    ECSServiceStackName: "ECS-Fargate-Service-Stack",
    ecsClusterStackName: "ECS-Cluster-Stack",
    serviceName: "ECS_Service",
    serviceNameAlb: "ECS_Service_Alb",
    taskmemoryLimitMiB: 512,
    taskCPU: 256,
    desiredCount: 2,
    containerPort: 3000,
    TgrAllowPort: 80,
    publicLoadBalancer: false,
    reactCodeLocation: "docker/nextjs-docker",
    nodeJsCodeLocation: "docker/nodejs_helloworld_docker",
    clusterName: "ECS_Cluster",
    /** Scaler */
    FargateAutoscalerStackName: "Fargate-Auto-Scaler-Stack",
    timeToNextChecker: 10,
    waitForSacleDone: 10,
    desireLv1: "10_20",
    desireLv2: "10_20",
    desireLv3: "10_20",
    desireLv4: "10_20",
    desireDone: 5,
    awsCliLayerArn: "arn:aws:serverlessrepo:ap-southeast-1:958575213991:applications/lambda-layer-awscli",
    awsCliLayerVersion: "1.18.142"
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG9CQUFvQjtBQUNQLFFBQUEsbUJBQW1CLEdBQUc7SUFDN0Isa0JBQWtCLEVBQUUsZ0JBQWdCO0lBQ3BDLE1BQU0sRUFBRSxlQUFlO0lBRXZCLGdCQUFnQjtJQUNoQixZQUFZLEVBQUUsZUFBZTtJQUM3QixXQUFXLEVBQUUsR0FBRztJQUNoQixLQUFLLEVBQUUsWUFBWTtJQUNuQixhQUFhLEVBQUUsR0FBRztJQUNsQixNQUFNLEVBQUUsQ0FBQztJQUNULElBQUksRUFBRSxhQUFhO0lBQ25CLFVBQVUsRUFBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0lBRTFCLGdCQUFnQjtJQUNoQixtQkFBbUIsRUFBRSwyQkFBMkI7SUFDaEQsbUJBQW1CLEVBQUUsbUJBQW1CO0lBQ3hDLFdBQVcsRUFBRSxhQUFhO0lBQzFCLGNBQWMsRUFBRSxpQkFBaUI7SUFDakMsa0JBQWtCLEVBQUUsR0FBRztJQUN2QixPQUFPLEVBQUUsR0FBRztJQUNaLFlBQVksRUFBRSxDQUFDO0lBQ2YsYUFBYSxFQUFFLElBQUk7SUFDbkIsWUFBWSxFQUFDLEVBQUU7SUFDZixrQkFBa0IsRUFBRSxLQUFLO0lBQ3pCLGlCQUFpQixFQUFFLHNCQUFzQjtJQUN6QyxrQkFBa0IsRUFBQyxpQ0FBaUM7SUFDcEQsV0FBVyxFQUFFLGFBQWE7SUFFMUIsYUFBYTtJQUNiLDBCQUEwQixFQUFDLDJCQUEyQjtJQUN0RCxpQkFBaUIsRUFBQyxFQUFFO0lBQ3BCLGdCQUFnQixFQUFDLEVBQUU7SUFDbkIsU0FBUyxFQUFDLE9BQU87SUFDakIsU0FBUyxFQUFDLE9BQU87SUFDakIsU0FBUyxFQUFDLE9BQU87SUFDakIsU0FBUyxFQUFDLE9BQU87SUFDakIsVUFBVSxFQUFDLENBQUM7SUFDWixjQUFjLEVBQUMscUZBQXFGO0lBQ3BHLGtCQUFrQixFQUFDLFVBQVU7Q0FFbEMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbIi8vY29uZmlndXJhdGlvbiBmaWxlXG5leHBvcnQgY29uc3QgYXBwbGljYXRpb25NZXRhRGF0YSA9IHtcbiAgICAgIGFwcGxpY2F0aW9uQWNjb3VudDogXCIke0FXU19BQ0NPVU5UfVwiLFxuICAgICAgcmVnaW9uOiBcIiR7QVdTX1JFR0lPTn1cIixcblxuICAgICAgLyoqIFZQQyBDb25maWcqL1xuICAgICAgdnBjU3RhY2tOYW1lOiBcIkVDUy1WUEMtU3RhY2tcIixcbiAgICAgIHVzZUV4aXN0VnBjOiBcIjBcIixcbiAgICAgIHZwY0lkOiBcInZwYy0xMjMxMjNcIixcbiAgICAgIHVzZURlZmF1bHRWcGM6IFwiMFwiLFxuICAgICAgbWF4QXpzOiAyLFxuICAgICAgY2lkcjogXCIxMC4wLjAuMC8xOFwiLFxuICAgICAgcHVibGljUG9ydDpbODAsIDQ0MywgMzAzNl0sXG5cbiAgICAgIC8qKiBFQ1MgQ29uZmlnKi9cbiAgICAgIEVDU1NlcnZpY2VTdGFja05hbWU6IFwiRUNTLUZhcmdhdGUtU2VydmljZS1TdGFja1wiLFxuICAgICAgZWNzQ2x1c3RlclN0YWNrTmFtZTogXCJFQ1MtQ2x1c3Rlci1TdGFja1wiLCBcbiAgICAgIHNlcnZpY2VOYW1lOiBcIkVDU19TZXJ2aWNlXCIsXG4gICAgICBzZXJ2aWNlTmFtZUFsYjogXCJFQ1NfU2VydmljZV9BbGJcIixcbiAgICAgIHRhc2ttZW1vcnlMaW1pdE1pQjogNTEyLFxuICAgICAgdGFza0NQVTogMjU2LFxuICAgICAgZGVzaXJlZENvdW50OiAyLFxuICAgICAgY29udGFpbmVyUG9ydDogMzAwMCxcbiAgICAgIFRnckFsbG93UG9ydDo4MCxcbiAgICAgIHB1YmxpY0xvYWRCYWxhbmNlcjogZmFsc2UsXG4gICAgICByZWFjdENvZGVMb2NhdGlvbjogXCJkb2NrZXIvbmV4dGpzLWRvY2tlclwiLCBcbiAgICAgIG5vZGVKc0NvZGVMb2NhdGlvbjpcImRvY2tlci9ub2RlanNfaGVsbG93b3JsZF9kb2NrZXJcIixcbiAgICAgIGNsdXN0ZXJOYW1lOiBcIkVDU19DbHVzdGVyXCIsXG5cbiAgICAgIC8qKiBTY2FsZXIgKi9cbiAgICAgIEZhcmdhdGVBdXRvc2NhbGVyU3RhY2tOYW1lOlwiRmFyZ2F0ZS1BdXRvLVNjYWxlci1TdGFja1wiLFxuICAgICAgdGltZVRvTmV4dENoZWNrZXI6MTAsXG4gICAgICB3YWl0Rm9yU2FjbGVEb25lOjEwLFxuICAgICAgZGVzaXJlTHYxOlwiMTBfMjBcIixcbiAgICAgIGRlc2lyZUx2MjpcIjEwXzIwXCIsIFxuICAgICAgZGVzaXJlTHYzOlwiMTBfMjBcIixcbiAgICAgIGRlc2lyZUx2NDpcIjEwXzIwXCIsXG4gICAgICBkZXNpcmVEb25lOjUsXG4gICAgICBhd3NDbGlMYXllckFybjpcImFybjphd3M6c2VydmVybGVzc3JlcG86YXAtc291dGhlYXN0LTE6OTU4NTc1MjEzOTkxOmFwcGxpY2F0aW9ucy9sYW1iZGEtbGF5ZXItYXdzY2xpXCIsXG4gICAgICBhd3NDbGlMYXllclZlcnNpb246XCIxLjE4LjE0MlwiXG4gXG59Il19