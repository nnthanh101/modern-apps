import * as cdk                  from '@aws-cdk/core';
import * as ec2                  from '@aws-cdk/aws-ec2';
import * as ecr                  from '@aws-cdk/aws-ecr';
import * as ecs                  from '@aws-cdk/aws-ecs';
import * as ecs_patterns         from '@aws-cdk/aws-ecs-patterns';
import * as iam                  from '@aws-cdk/aws-iam';
import * as codebuild            from '@aws-cdk/aws-codebuild';
import * as codecommit           from '@aws-cdk/aws-codecommit';
// import * as targets              from '@aws-cdk/aws-events-targets';
// import * as codedeploy           from '@aws-cdk/aws-codedeploy';
import * as codepipeline         from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as elb                  from '@aws-cdk/aws-elasticloadbalancingv2';
import * as ats                  from '@aws-cdk/aws-applicationautoscaling';
import * as dotenv               from "dotenv";


/**
 * 
 */
export class EcsFargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    dotenv.config();
    // The code that defines your stack goes here
    /**
     * 1. Create a new VPC with NO NAT Gateway --> reduce cost!
     */
    const vpc = new ec2.Vpc(this, 'ECS-VPC', {
      maxAzs: 2,
      cidr: '10.0.0.0/18',
      natGateways: 0
    })


    /**
     * 2. ECS Cluster: IAM Role, ECS-Logs, ECS-Tasks Role
     */    
    const clusterAdmin = new iam.Role(this, 'ClusterAdminRole', {
      assumedBy: new iam.AccountRootPrincipal()
    });
    

    const cluster = new ecs.Cluster(this, "ClusterAdminRole", {
      vpc: vpc,
      containerInsights: true
    });
    
    // Create Group Security
    const applicationLoadBalancerSecurityGroup = new ec2.SecurityGroup(this, 'ApplicationLoadBalancerSecurityGroup', {vpc});
    const ecsFargateServiceSecurityGroup = new ec2.SecurityGroup(this, 'EcsFargateServiceSecurityGroup', {vpc});
    
    // Set open port group security
    applicationLoadBalancerSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
    ecsFargateServiceSecurityGroup.addIngressRule(applicationLoadBalancerSecurityGroup, ec2.Port.tcp(8080));
    
    /**
     * ECR - repo
     */ 
    const ecrRepo = new ecr.Repository(this, 'ECRRepository');

    /**
     * 3. ECS Contructs
     */

    const applicationLoadBalancer = new elb.ApplicationLoadBalancer(this, 'ApplicationLoadBalancer', {
      vpc,
      deletionProtection: false,
      http2Enabled: true,
      internetFacing: true,
      securityGroup: applicationLoadBalancerSecurityGroup,
      vpcSubnets: {subnetType: ec2.SubnetType.PUBLIC}
    });
    const httpsListener = applicationLoadBalancer.addListener('HttpListener', {
      port: 80,
      protocol: elb.ApplicationProtocol.HTTP,
      defaultAction: elb.ListenerAction.redirect({protocol: 'HTTP', port: '80'})
    });

    const executionRolePolicy =  new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'],
          actions: [
                    "ecr:GetAuthorizationToken",
                    "ecr:BatchCheckLayerAvailability",
                    "ecr:GetDownloadUrlForLayer",
                    "ecr:BatchGetImage",
                    "ecs:DescribeCluster",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ]
        });

    const taskRole = new iam.Role(this, `ecs-taskRole-${this.stackName}`, {
          roleName: `ecs-taskRole-${this.stackName}`,
          assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com')
        });

    const ecsFargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'ECSFargateTaskDefinition', {
      memoryLimitMiB: 512,
      cpu: 256,
      taskRole: taskRole
    });

    ecsFargateTaskDefinition.addToExecutionRolePolicy(executionRolePolicy);

    /**
     * codelocation: "react"      --> /react/*
     * codelocation: "springboot" --> /springboot/*
     */
    const ecsContainer = ecsFargateTaskDefinition.addContainer('ECS-Task-SpringBoot', {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      logging: ecs.LogDriver.awsLogs({
                streamPrefix: `${this.stackName}ECSContainerLog`,
              })
    });

    ecsContainer.addPortMappings({
      hostPort: 8080,
      containerPort: 8080,
      protocol: ecs.Protocol.TCP
    });

    /** 
     * @deprecated ecs_patterns.ApplicationLoadBalancedFargateService 
     * TODO: ALB >> Shared 1 ALB across multiple ECS-Services/Stack
     * TODO: ALB >> Route53/DNS + ACM/SSL
     */
    // const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "ecs-service", {

    const ecsFargateServiceTargetGroup = new elb.ApplicationTargetGroup(this,'ECSFargateServiceTargetGroup',{
      port: 80,
      healthCheck:{
        enabled: true,
        path: "/",
        port: '8080',
        protocol:elb.Protocol.HTTP,
        unhealthyThresholdCount:5,
        timeout:cdk.Duration.seconds(45),
        interval:cdk.Duration.seconds(60),
        healthyHttpCodes:'200,301,302'
      },
      stickinessCookieDuration:cdk.Duration.seconds(604800),
      targetType: elb.TargetType.IP,
      vpc: vpc
      
    });
    httpsListener.addTargetGroups('Web', {targetGroups: [ecsFargateServiceTargetGroup]});

    const ecsFargateService = new ecs.FargateService(this, 'ECSFargateService', {
      cluster: cluster,
      desiredCount: 3,
      assignPublicIp: false,
      maxHealthyPercent: 200,
      minHealthyPercent: 50,
      deploymentController: {
        type: ecs.DeploymentControllerType.ECS
      },
      healthCheckGracePeriod: cdk.Duration.seconds(60),
      securityGroups: [ecsFargateServiceSecurityGroup],
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE
      },
      taskDefinition: ecsFargateTaskDefinition
    });
    ecsFargateService.node.addDependency(httpsListener);
    ecsFargateService.attachToApplicationTargetGroup(ecsFargateServiceTargetGroup);

    /** FIXME */
    // const scaling = ecsFargateService.autoScaleTaskCount({ maxCapacity: 6 });
    // scaling.scaleOnCpuUtilization('CpuScaling', {
    //   targetUtilizationPercent: 10,
    //   scaleInCooldown: cdk.Duration.seconds(60),
    //   scaleOutCooldown: cdk.Duration.seconds(60)
    // });  

    const ecsFargateServiceScaling = new ats.ScalableTarget(this, 'ecsFargateServiceScaling', {
      scalableDimension: 'ecs:service:DesiredCount',
      minCapacity: 2,
      maxCapacity: 12,
      serviceNamespace: ats.ServiceNamespace.ECS,
      resourceId: `service/${cluster.clusterName}/${ecsFargateService.serviceName}`
    });

    ecsFargateServiceScaling.scaleToTrackMetric('scaleCPU', {
      customMetric: ecsFargateService.metricCpuUtilization(),
      targetValue: 70,
      scaleInCooldown: cdk.Duration.minutes(1),
      scaleOutCooldown: cdk.Duration.minutes(3)
    });


    /**
     * 4. PIPELINE CONSTRUCTS
     */
    
    /**  
     * Using CodeCommit
     * 
     * FIXME: Github Action
     */
    // const gitHubSource = codebuild.Source.gitHub({
    //   owner: 'nnthanh101',
    //   repo: 'cdk',
    //   webhook: true, // optional, default: true if `webhookFilteres` were provided, false otherwise
    //   webhookFilters: [
    //     codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs('main'),
    //   ], // optional, by default all pushes and Pull Requests will trigger a build
    // });

    const repository = new codecommit.Repository(this, 'CodeRepositoryDemo', { repositoryName: 'WebSpringBoot' });

    /** 4.2. CODEBUILD - project */
  
    const project = new codebuild.Project(this, 'ECS-CodeBuild-Project', {
      projectName: `${this.stackName}`,
      // source: gitHubSource,
      source: codebuild.Source.codeCommit({ repository }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_2,
        privileged: true
      },
      environmentVariables: {
        'CLUSTER_NAME': {
          value: `${cluster.clusterName}`
        },
        'ECR_REPO_URI': {
          value: `${ecrRepo.repositoryUri}`
        }
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          pre_build: {
            commands: [
              'env',
              'COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)',
              'TAG=${COMMIT_HASH:=latest}',
              // 'export TAG=${CODEBUILD_RESOLVED_SOURCE_VERSION}',
            ]
          },
          build: {
            commands: [
              'echo cd docker/$ECR_REPO_URI',
              `echo Build $ECR_REPO_URI`,
              `mvn compile -DskipTests`,
              `mvn package -DskipTests`,
              `echo Building the Docker image...`,
              `docker build -t $ECR_REPO_URI:latest .`,
              // `docker build -t $ECR_REPO_URI:$TAG .`,
              `docker tag $ECR_REPO_URI:latest $ECR_REPO_URI:$TAG`,
              '$(aws ecr get-login --no-include-email)',
              // 'docker push $ECR_REPO_URI:$TAG',
              'docker push $ECR_REPO_URI:latest',
              'docker push $ECR_REPO_URI:$TAG'
            ]
          },
          post_build: {
            commands: [
              'echo "In Post-Build Stage"',
              "printf '[{\"name\":\"ECS-Task-SpringBoot\",\"imageUri\":\"%s\"}]' $ECR_REPO_URI:$TAG > imagedefinitions.json",
              "pwd; ls -al; cat imagedefinitions.json"
            ]
          }
        },
        artifacts: {
          files: [
            'imagedefinitions.json'
          ]
        }
      })
    });

    /**
     * 5. PIPELINE ACTIONS
     */
    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    /**
     * CodeCommitSourceAction
     * FIXME GitHubSourceAction
     */
    // const sourceAction = new codepipeline_actions.GitHubSourceAction({
    //   actionName: 'GitHub_Source',
    //   owner: 'nnthanh101',
    //   repo: 'cdk',
    //   branch: 'main',
    //   oauthToken: cdk.SecretValue.secretsManager("/my/github/token"),
    //   //oauthToken: cdk.SecretValue.plainText('<plain-text>'),
    //   output: sourceOutput
    const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository,
      output: sourceOutput,
    });

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project: project,
      input: sourceOutput,
      outputs: [buildOutput],
    });

    /**
     * FIXME SNS Notification via SMS, Email, ...
     */
    const manualApprovalAction = new codepipeline_actions.ManualApprovalAction({
      actionName: 'Approve',
    });

    const deployAction = new codepipeline_actions.EcsDeployAction({
      actionName: 'DeployAction',
      service: ecsFargateService,
      imageFile: new codepipeline.ArtifactPath(buildOutput, `imagedefinitions.json`)
    });


    /** PIPELINE STAGES */

    new codepipeline.Pipeline(this, 'ECSPipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [buildAction],
        },
        {
          stageName: 'Approve',
          actions: [manualApprovalAction],
        },
        {
          stageName: 'Deploy-to-ECS',
          actions: [deployAction],
        }
      ]
    });


    ecrRepo.grantPullPush(project.role!);
    project.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        "ecs:DescribeCluster",
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer"
        ],
      resources: [`${cluster.clusterArn}`],
    }));


    /**
     * 6. OUTPUT
     */

    new cdk.CfnOutput(this, 'LoadBalancerDNS', { value: applicationLoadBalancer.loadBalancerDnsName });
    new cdk.CfnOutput(this, `codecommit-uri`, {
            exportName: 'CodeCommitURL',
            value: repository.repositoryCloneUrlHttp
        });
  }

}
