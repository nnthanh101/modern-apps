export const applicationMetaData = {
    ecsStackName: "EcsPipelineStack",
    
    
    /*AWSAcount*/
    awsAccount: "${AWS_ACCOUNT}",
    awsRegion: "${AWS_REGION}",
    
    /*VPCStackProps*/
    VpcName: "VPCName",
    maxAzs: 2,
    cidr: "10.0.0.0/16",
    ecsClusterStackName: "App-Public-Cluster-Stack",
    clusterName: "AppEcsCluster",
    allowPort: 80,
    
    SecurityGroupName: "FrontendSecurityGroup",
    
    /*FargateTaskStack*/
    memoryLimitMiB: 512,
    cpu: 256,
    codeLocaltion: "",
    
    loadBalancerName: "ECS-LoadBalancer",
    targetGroupName: "ECS-Targets",
    
    wwwCodeLocation: "www",
    
    createVpc: true,
    
    // FargateFastAutoscalerProps
    
    /* AVG_Instances */
    desireLv1: "3_3", 
    desireLv2: "10_5",
    desireLv3: "50_10",
    desireLv4: "100_20",
    desireDone: "2",
    timeToNextChecker: 3, //secons
    waitForSacleDone: 60, //secons

}