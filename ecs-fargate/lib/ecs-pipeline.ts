import * as cdk from "@aws-cdk/core";
import {Role, ServicePrincipal, ManagedPolicy} from "@aws-cdk/aws-iam";
import { Bucket, BucketEncryption } from "@aws-cdk/aws-s3";
import { Repository } from "@aws-cdk/aws-codecommit";
import { Pipeline, Artifact } from "@aws-cdk/aws-codepipeline";
import { Project, LinuxBuildImage, BuildSpec, PipelineProject } from "@aws-cdk/aws-codebuild";
import { CodeBuildAction, CodeCommitSourceAction, EcsDeployAction } from "@aws-cdk/aws-codepipeline-actions";
import { FargateService } from "@aws-cdk/aws-ecs"
export interface FargatePipelineStackProps extends cdk.StackProps {
  readonly repositoryName?: string;
  readonly sourceFilename?: string;
  readonly fgservice: FargateService;
}

export class FargatePipelineStack extends cdk.Stack {
  constructor(
    scope: cdk.Construct,
    id: string,
    props: FargatePipelineStackProps
  ) {
    super(scope, id, props);
    
    const cb_role = new Role(this, id + "-RoleCB", {
      assumedBy: new ServicePrincipal("codebuild.amazonaws.com"),
      description:
        "Adds managed policies to CodeBuild role for pipeline execution",
    });

    /** Attach managed policies only... */
    cb_role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonEC2ContainerRegistryPowerUser"
      )
    );
    cb_role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );
    cb_role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonEC2ContainerRegistryFullAccess"
      )
    );
    cb_role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsFullAccess")
    );
    cb_role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AWSCodePipelineFullAccess")
    );
    
    /** CodePipeline Role */
    const pipeline_role = new Role(this, id + "-RolePP", {
      assumedBy: new ServicePrincipal("codepipeline.amazonaws.com")
    });

    /** Attach managed policies to CodePipeline */
    pipeline_role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AWSCodeCommitFullAccess")
    );
    pipeline_role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")
    );
    pipeline_role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonECS_FullAccess")
    );
    pipeline_role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("IAMFullAccess")
    );

    /** S3 Bucket for artifact outputs */
    const pipelineOutputs = new Bucket(this, "pipeline-build-outputs", {
      bucketName: "pipeline-artifact-outputs",
      encryption: BucketEncryption.UNENCRYPTED,
      versioned: true,
    });

    const codRepo = new Repository(this, id + "-Repository", {
      repositoryName: props.repositoryName ?? "repositoryName",
      description: "Some description.",
    });
    
    new cdk.CfnOutput(this, "ApplicationLoadBalancer DNS", {
      value: codRepo.repositoryCloneUrlHttp,
    });
    

    // Pipeline Build Stage
    const cdkBuild = new PipelineProject(this, id + "-PipelineProject", {
      role: cb_role,
      buildSpec: BuildSpec.fromSourceFilename(props.sourceFilename ?? "./buildspec.yml"), // Name of your buildspec file here
      environment: {
        buildImage: LinuxBuildImage.AMAZON_LINUX_2_3,
        privileged: true,
      },
      
    });

    // We could add the CodeBuild for S3 upload and github enterprise pull here...
    const sourceOutput = new Artifact("Source");
    const cdkBuildOutput = new Artifact("Build");

    // Pipeline ECS Deploy Stage
    new Pipeline(this, "Pipeline", {
      role: pipeline_role,
      restartExecutionOnUpdate: true,
      artifactBucket: pipelineOutputs,
      stages: [
        {
          stageName: "Source",
          actions: [
            new CodeCommitSourceAction({
              actionName: "CodeCommit_Source",
              repository: codRepo,
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: "Build",
          actions: [
            new CodeBuildAction({
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
            new EcsDeployAction({
              actionName: "ecs_deploy",
              service: props.fgservice,
              input: cdkBuildOutput,
            }),
          ],
        },
      ],
    });
  }
}
