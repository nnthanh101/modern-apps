//configuration file
export const applicationMetaData = {
      applicationAccount: "${AWS_ACCOUNT}",
      region: "${AWS_REGION}",
      ECSServiceStackName: "ECS-Fargate-Service-Stack",
      ECSServiceStackAlbName: "ECS-Fargate-Service-Stack-app",
      serviceName: "ECS_Service",
      serviceNameAlb: "ECS_Service_Alb",
      taskmemoryLimitMiB: 1024,
      taskCPU: 512,
      desiredCount: 4,
      containerPort:8000,
      publicLoadBalancer: false,
      springCodeLocation: "springboot-aws",
      vpcStackName: "ECS-VPC-Stack",
      maxAzs: 2,
      cidr: "10.0.0.0/18",
      ecsClusterStackName: "ECS-Cluster-Stack",
      clusterName: "ECS_Cluster",
      cognitoStackName: "Cognito-Stack",
      userPoolName:"Cognito_UserPool",
      clientName: "Cognito_Client",
      refreshTokenValidity: 3650,
      explicitAuthFlows: ["ALLOW_USER_SRP_AUTH","ALLOW_REFRESH_TOKEN_AUTH","ALLOW_ADMIN_USER_PASSWORD_AUTH"],
      domainPrefix:"ecs-pool",
      allowedOAuthScopes: ['phone', 'email', 'openid','profile'],
      callbackUrLs: ['https://aws.job4u.io'],
      allowedOAuthFlowsUserPoolClient:true,
      allowedOAuthFlows:['implicit'],
      supportedIdentityProviders:['COGNITO'],
      generateSecret: false,
      dynamoDBStackName: "DynamoDB-Stack",
      writeCapacity: 5,
      readCapacity: 5,
      tableName: "TravelBuddyTripSectors",
      partitionKeyName: "travelId",
      apiGatewayStackName: "APIGW-Stack",
      restApiName: "DynamoDB_API",
      vpcLinkName: "VPC_Link",
      vpcLinkDescription: "VPC Link",
      stageName: "test",
      identitySource: "method.request.header.x-amzn-authorization",
      dataTraceEnabled: true,
      tracingEnabled: true,
      bastionHostStackName: "BastionHost-Stack",
      openSSHfrom: "0.0.0.0/0"
}