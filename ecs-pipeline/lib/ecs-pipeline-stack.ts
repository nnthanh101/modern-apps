import * as cdk from "@aws-cdk/core";
import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");
import s3 = require("@aws-cdk/aws-s3");
import iam = require("@aws-cdk/aws-iam");
import elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");

import cloudwatch = require("@aws-cdk/aws-cloudwatch");
import codebuild = require("@aws-cdk/aws-codebuild");
import codecommit = require("@aws-cdk/aws-codecommit");
import codepipeline = require("@aws-cdk/aws-codepipeline");
import codepipeline_actions = require("@aws-cdk/aws-codepipeline-actions");

import autoscaling = require("@aws-cdk/aws-autoscaling");

import { applicationMetaData } from "../configurations/config";
import {
  ApplicationLoadBalancer,
  IpAddressType,
  ApplicationProtocol,
} from "@aws-cdk/aws-elasticloadbalancingv2";
import { SubnetType } from "@aws-cdk/aws-ec2";

export interface PipelineStackProps extends cdk.StackProps {
  /** Import from entry-point if needed */
  readonly tags?: {
    [key: string]: string;
  };
}

export class EcsPipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * 1. Create VPC
     *
     *
     **/
    
    const vpc = ec2.Vpc.fromLookup(this, applicationMetaData.VpcName,  {
      vpcName: applicationMetaData.ecsStackName + "/" + applicationMetaData.VpcName
    });
    
    
    // const vpc = new ec2.Vpc(this, applicationMetaData.VpcName, {
    //   maxAzs: applicationMetaData.maxAzs,
    //   cidr: applicationMetaData.cidr,
    //   subnetConfiguration: [
    //     {
    //       name: "Public-Subnet-App",
    //       cidrMask: 24,
    //       subnetType: ec2.SubnetType.PUBLIC,
    //     },
    //   ],
    //   gatewayEndpoints: {
    //     S3: {
    //       service: ec2.GatewayVpcEndpointAwsService.S3,
    //     },
    //   },
    //   natGateways: 1,
    // });

    /**
     * 2. Create Security Group
     *
     *
     **/

    const securityGrp = new ec2.SecurityGroup(
      this,
      applicationMetaData.SecurityGroupName,
      {
        vpc: vpc,
        allowAllOutbound: false,
        securityGroupName: applicationMetaData.SecurityGroupName,
      }
    );

    // Inbound 
    securityGrp.addIngressRule(ec2.Peer.anyIpv4(),ec2.Port.tcp(applicationMetaData.allowPort));
    // outbound 
    securityGrp.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.allTcp())

    /**
     * 3. Create Cluster
     *
     *
     **/
    const cluster = new ecs.Cluster(this, applicationMetaData.clusterName, {
      vpc: vpc,
      clusterName: applicationMetaData.clusterName,
    });

    /**
     * 4. Create ALB
     *
     *
     **/
    const alb = new ApplicationLoadBalancer(
      this,
      applicationMetaData.loadBalancerName,
      {
        vpc: vpc,
        internetFacing: true,
        ipAddressType: IpAddressType.IPV4,
        securityGroup: securityGrp,
        vpcSubnets: vpc.selectSubnets({
          subnetType: SubnetType.PUBLIC,
        }),
        loadBalancerName: applicationMetaData.loadBalancerName,
      }
    );

    const targetGrp = new elbv2.ApplicationTargetGroup(
      this,
      applicationMetaData.targetGroupName,
      {
        vpc: vpc,
        protocol: elbv2.ApplicationProtocol.HTTP,
        port: applicationMetaData.allowPort,
        targetType: elbv2.TargetType.IP,
        targetGroupName: applicationMetaData.targetGroupName,
      }
    );

    const loadBalancerListener = alb.addListener("Listener80", {
      protocol: ApplicationProtocol.HTTP,
      port: applicationMetaData.allowPort,
      open: true,
      defaultTargetGroups: [targetGrp],
    });

    /** CloudFormation Output >> DNS URL for ELB */
    new cdk.CfnOutput(this, "LoadBalancerDNS", {
      value: alb.loadBalancerDnsName,
    });

    /**
     * 5. Create Role-ECS Fargate
     *
     *
     **/
    const taskRole = new iam.Role(this, "taskRole", {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
      description:
        "Adds managed policies to ecs role for ecr image pulls and execution",
    });

    const ecsPolicy: iam.Policy = new iam.Policy(this, "ecsPolicy", {
      policyName: `ecs-iam-inPol`,
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "ecr:GetAuthorizationToken",
            "ecr:BatchCheckLayerAvailability",
            "ecr:GetDownloadUrlForLayer",
            "ecr:BatchGetImage",
            "logs:CreateLogStream",
            "logs:CreateLogGroup",
            "logs:PutLogEvents",
          ],
          resources: ["*"],
        }),
      ],
    });

    taskRole.attachInlinePolicy(ecsPolicy);
    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonEC2ContainerRegistryPowerUser"
      )
    );
    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonECS_FullAccess")
    );
    taskRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsFullAccess")
    );

    /**
     * 6. ECS Task
     * @todo configurables `memoryLimitMiB` & `cpu`
     */

    /** 6.1. Create ECS Task definition */
    const taskDef = new ecs.FargateTaskDefinition(this, "Task-Definition", {
      memoryLimitMiB: 512,
      cpu: 256,
      executionRole: taskRole,
    });

    /** 6.2. Add Container Docker-Image */
    const appContainer = new ecs.ContainerDefinition(this, "AppContainer", {
      image: ecs.ContainerImage.fromAsset(applicationMetaData.wwwCodeLocation),
      taskDefinition: taskDef,
    });

    /** 6.3. Port mapping
     * @todo configurables `hostPort` & `containerPort`
     * @todo `protocol` NLB vs. ALB ?
     */
    appContainer.addPortMappings({
      hostPort: applicationMetaData.allowPort,
      containerPort: applicationMetaData.allowPort,
      protocol: ecs.Protocol.TCP,
    });

    /**
     * 7. Create Fargate Service
     * @todo configurable `desiredCount`, `maxHealthyPercent`, `minHealthyPercent`
     */
    const service = new ecs.FargateService(this, "Fargate-Service", {
      cluster: cluster,
      taskDefinition: taskDef,
      desiredCount: 2,
      maxHealthyPercent: 200,
      minHealthyPercent: 100,
      // securityGroup: securityGrp,
      assignPublicIp: true,
    });

    /**
     * 8.1. CodeBuild Roles & Policies
     */
    /** Create custom IAM role for CodeBuild */
    const cb_role = new iam.Role(this, "cb-role", {
      assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
      description:
        "Adds managed policies to CodeBuild role for pipeline execution",
    });

    /** Attach managed policies only... */
    cb_role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonEC2ContainerRegistryPowerUser"
      )
    );
    cb_role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );
    cb_role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonEC2ContainerRegistryFullAccess"
      )
    );
    cb_role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsFullAccess")
    );
    cb_role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSCodePipelineFullAccess")
    );

    /**
     * 8.2. CodePipeline Roles & Policies
     */
    /** CodePipeline Role */
    const pipeline_role = new iam.Role(this, "pipeline-role", {
      assumedBy: new iam.ServicePrincipal("codepipeline.amazonaws.com"),
      description: "CodePipeline Role",
    });

    /** Attach managed policies to CodePipeline */
    pipeline_role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AWSCodeCommitFullAccess")
    );
    pipeline_role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );
    pipeline_role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonECS_FullAccess")
    );
    pipeline_role.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("IAMFullAccess")
    );

    /** S3 Bucket for artifact outputs */
    const pipelineOutputs = new s3.Bucket(this, "pipeline-build-outputs", {
      bucketName: "pipeline-artifact-outputs",
      encryption: s3.BucketEncryption.UNENCRYPTED,
      versioned: true,
    });

    /**
     * 9. CodePipeline
     */

    // Pipeline Source Stage
    // const code_repo = codecommit.Repository.fromRepositoryName(
    //   this,
    //   "ImportedRepo",
    //   "react-boilerplate"
    // );

    const code_repo = new codecommit.Repository(this, "Repository", {
      repositoryName: "FontendRepository",
      description: "Some description.",
    });

    // Pipeline Build Stage
    const cdkBuild = new codebuild.PipelineProject(this, "CdkBuild", {
      role: cb_role,
      buildSpec: codebuild.BuildSpec.fromSourceFilename("./buildspec.yml"), // Name of your buildspec file here
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_3,
        privileged: true,
      },
    });

    // We could add the CodeBuild for S3 upload and github enterprise pull here...
    const sourceOutput = new codepipeline.Artifact();
    const cdkBuildOutput = new codepipeline.Artifact();

    loadBalancerListener.addTargetGroups(`${targetGrp}`, {
      targetGroups: [targetGrp],
      priority: 2,
      pathPattern: "/",
    });

    targetGrp.addTarget(service);

    // Pipeline ECS Deploy Stage
    new codepipeline.Pipeline(this, "Pipeline", {
      role: pipeline_role,
      restartExecutionOnUpdate: true,
      artifactBucket: pipelineOutputs,
      stages: [
        {
          stageName: "Source",
          actions: [
            new codepipeline_actions.CodeCommitSourceAction({
              actionName: "CodeCommit_Source",
              repository: code_repo,
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: "Build",
          actions: [
            new codepipeline_actions.CodeBuildAction({
              actionName: "CDK_Build",
              project: cdkBuild,
              input: sourceOutput,
              outputs: [cdkBuildOutput],
            }),
          ],
        },
        {
          stageName: "Deploy",
          actions: [
            new codepipeline_actions.EcsDeployAction({
              actionName: "ecs_deploy",
              service: service,
              input: cdkBuildOutput,
            }),
          ],
        },
      ],
    });

    /**
     * 10. CloudWatch Dashboard
     */
    // Setup CloudWatch Dashboard
    const totalBuildFailMetric = new cloudwatch.Metric({
      namespace: "AWS/CodeBuild",
      metricName: "FailedBuilds",
      dimensions: { ProjectName: `${cdkBuild.projectName}` },
      statistic: "Sum",
      period: cdk.Duration.days(7),
    });

    const totalBuildDurationMetric = new cloudwatch.Metric({
      namespace: "AWS/CodeBuild",
      metricName: "Duration",
      dimensions: { ProjectName: `${cdkBuild.projectName}` },
      statistic: "Average",
      period: cdk.Duration.days(7),
    });

    const totalPostBuildDurationMetric = new cloudwatch.Metric({
      namespace: "AWS/CodeBuild",
      metricName: "PostBuildDuration",
      dimensions: { ProjectName: `${cdkBuild.projectName}` },
      statistic: "Average",
      period: cdk.Duration.days(7),
    });

    const totalBuildsMetric = new cloudwatch.Metric({
      namespace: "AWS/CodeBuild",
      metricName: "Builds",
      dimensions: { ProjectName: `${cdkBuild.projectName}` },
      statistic: "Sum",
      period: cdk.Duration.days(7),
    });

    const ecsMemoryMetric = new cloudwatch.Metric({
      namespace: "AWS/ECS",
      metricName: "MemeoryUtilization",
      dimensions: { ProjectName: `${service.serviceName}` },
      statistic: "Average",
      period: cdk.Duration.minutes(5),
    });

    const ecsCPUMetric = new cloudwatch.Metric({
      namespace: "AWS/ECS",
      metricName: "CPUUtilization",
      dimensions: { ProjectName: `${service.serviceName}` },
      statistic: "Average",
      period: cdk.Duration.minutes(5),
    });

    const applicationELBMetric = new cloudwatch.Metric({
      namespace: "AWS/ApplicationELB",
      metricName: "LoadBalancer",
      dimensions: { ProjectName: `${service.serviceName}` },
      statistic: "Sum",
      period: cdk.Duration.minutes(1),
    });

    const applicationTargetMetric = new cloudwatch.Metric({
      namespace: "AWS/ApplicationELB",
      metricName: "TargetGroup",
      dimensions: { ProjectName: `${alb.loadBalancerName}` },
      statistic: "Sum",
      period: cdk.Duration.minutes(15),
    });

    const buildFailAlarm = new cloudwatch.Metric({
      namespace: "AWS/CodeBuild",
      metricName: "FailedBuilds",
      dimensions: { ProjectName: `${targetGrp.targetGroupName}` },
      statistic: "Sum",
      period: cdk.Duration.minutes(5),
    });

    new cloudwatch.Alarm(this, "Alarm", {
      metric: buildFailAlarm,
      threshold: 1,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
    });

    const dashboard = new cloudwatch.Dashboard(this, "CodePipeline-Dashboard", {
      dashboardName: "ecs-pipeline-dashboard",
      start: "-9H",
      end: "2020-03-25T06:00:00.000Z",
      periodOverride: cloudwatch.PeriodOverride.INHERIT,
    });
    dashboard.addWidgets(
      new cloudwatch.SingleValueWidget({
        region: "ap-southeast-1",
        metrics: [
          totalBuildsMetric,
          totalBuildDurationMetric,
          totalPostBuildDurationMetric,
          totalBuildFailMetric,
        ],
        title: "CodeBuild Metrics Past 7 Days",
        height: 5,
        width: 14,
      })
    );
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        region: "ap-southeast-1",
        left: [ecsMemoryMetric, ecsCPUMetric],
        title: "ECS CPU-Memeory Utilization Past 7 Days",
        stacked: true,
        height: 10,
        width: 14,
      })
    );
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        region: "ap-southeast-1",
        left: [applicationELBMetric, applicationTargetMetric],
        title: "Load Balancer Connection Requests Past 7 Days",
        stacked: false,
        height: 10,
        width: 14,
      })
    );
  }
}
