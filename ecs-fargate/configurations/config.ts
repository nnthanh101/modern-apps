//configuration file
export const applicationMetaData = {
      applicationAccount: "${AWS_ACCOUNT}",
      region: "${AWS_REGION}",

      /** VPC Config*/
      vpcStackName: "ECS-VPC-Stack",
      useExistVpc: "0",
      vpcId: "vpc-123123",
      useDefaultVpc: "0",
      maxAzs: 2,
      cidr: "10.0.0.0/18",
      publicPort:[80, 443, 3036],

      /** ECS Config*/
      ECSServiceStackName: "ECS-Fargate-Service-Stack",
      ecsClusterStackName: "ECS-Cluster-Stack", 
      serviceName: "ECS_Service",
      serviceNameAlb: "ECS_Service_Alb",
      taskmemoryLimitMiB: 512,
      taskCPU: 256,
      desiredCount: 2,
      containerPort: 3000,
      TgrAllowPort:80,
      publicLoadBalancer: false,
      reactCodeLocation: "docker/nextjs-docker", 
      nodeJsCodeLocation:"docker/nodejs_docker",
      clusterName: "ECS_Cluster",

      /** Scaler */
      FargateAutoscalerStackName:"Fargate-Auto-Scaler-Stack",
      timeToNextChecker:10,
      waitForSacleDone:10,
      desireLv1:"10_20",
      desireLv2:"10_20", 
      desireLv3:"10_20",
      desireLv4:"10_20",
      desireDone:5,
      awsCliLayerArn:"arn:aws:serverlessrepo:ap-southeast-1:958575213991:applications/lambda-layer-awscli",
      awsCliLayerVersion:"1.18.142"
 
}