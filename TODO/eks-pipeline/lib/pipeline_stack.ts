import * as cdk from '@aws-cdk/core';
import { Repository } from '@aws-cdk/aws-ecr';
import * as codecommit from '@aws-cdk/aws-codecommit';
import { PipelineProject, BuildSpec, LinuxBuildImage, ComputeType, BuildEnvironmentVariableType } from '@aws-cdk/aws-codebuild';
import { Artifact, Pipeline, } from '@aws-cdk/aws-codepipeline';
import { CodeCommitSourceAction, CodeBuildAction } from '@aws-cdk/aws-codepipeline-actions';
import { ManagedPolicy, PolicyStatement } from '@aws-cdk/aws-iam';
import { Cluster } from '@aws-cdk/aws-eks';
import { CfnCacheCluster } from '@aws-cdk/aws-elasticache';
import { DatabaseCluster } from '@aws-cdk/aws-rds';

export interface PipelineProps {
    readonly eksCluster: Cluster;
    readonly redisCluster: CfnCacheCluster;
    readonly rds: DatabaseCluster;
    readonly tags?: {
        [key: string]: string;
    };
}
export class PipelineStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: PipelineProps) {
        super(scope, id, props);

        const ecr_repo = new Repository(this, "ECRRep", { repositoryName: "springboot-multiarch" });
        //   create code repo

        const code = new codecommit.Repository(this, "CodeRep", { repositoryName: 'springboot-multiarch', });
        new cdk.CfnOutput(this, "CodeCommitOutput", { value: code.repositoryCloneUrlHttp })

        // create code builds
        const arm_build = new PipelineProject(this, "ARMBuild", {
            buildSpec: BuildSpec.fromSourceFilename("./pipeline/armbuild.yml"),
            environment: {
                buildImage: LinuxBuildImage.AMAZON_LINUX_2_3,
                privileged: true,
                computeType: ComputeType.MEDIUM,
            },
            environmentVariables:
            {
                REPOSITORY_URI: { value: ecr_repo.repositoryUri },
                DOCKERHUB_USERNAME: { value: '/springboot-multiarch/dockerhub/username', type: BuildEnvironmentVariableType.PARAMETER_STORE},
                DOCKERHUB_PASSWORD: { value: '/springboot-multiarch/dockerhub/password', type: BuildEnvironmentVariableType.PARAMETER_STORE },
                REDIS_HOST: { value: props?.redisCluster.attrRedisEndpointAddress},
                REDIS_PORT: { value: props?.redisCluster.attrRedisEndpointPort},
                RDS_SECRET:  { value: props?.rds.secret?.secretName},
                RDS_HOST: {value: props?.rds.clusterEndpoint.hostname},
                RDS_PORT: {value: props?.rds.clusterEndpoint.port},
                EKS_NAME: {value:props?.eksCluster.clusterName},
                EKS_ROLE: {value:props?.eksCluster.kubectlRole?.roleArn},
            },
        })
        this.add_role_access_to_build(arm_build);

        const amd_build = new PipelineProject(this, "AMDBuild", {
            buildSpec: BuildSpec.fromSourceFilename("./pipeline/amdbuild.yml"),
            environment: {
                buildImage: LinuxBuildImage.AMAZON_LINUX_2_3,
                privileged: true
            },
            // environmentVariables=self.get_build_env_vars(ecr_repo)
            environmentVariables:
            {
                REPOSITORY_URI: { value: ecr_repo.repositoryUri },
                DOCKERHUB_USERNAME: { value: '/springboot-multiarch/dockerhub/username', type: BuildEnvironmentVariableType.PARAMETER_STORE},
                DOCKERHUB_PASSWORD: { value: '/springboot-multiarch/dockerhub/password', type: BuildEnvironmentVariableType.PARAMETER_STORE },
                REDIS_HOST: { value: props?.redisCluster.attrRedisEndpointAddress},
                REDIS_PORT: { value: props?.redisCluster.attrRedisEndpointPort},
                RDS_SECRET:  { value: props?.rds.secret?.secretName},
                RDS_HOST: {value: props?.rds.clusterEndpoint.hostname},
                RDS_PORT: {value: props?.rds.clusterEndpoint.port},
                EKS_NAME: {value:props?.eksCluster.clusterName},
                EKS_ROLE: {value:props?.eksCluster.kubectlRole?.roleArn},
            },
        });
        this.add_role_access_to_build(amd_build)

        const post_build = new PipelineProject(this, "PostBuild", {
            buildSpec: BuildSpec.fromSourceFilename("./pipeline/post_build.yml"),
            environment: {
                buildImage: LinuxBuildImage.AMAZON_LINUX_2_3,
                privileged: true
            },
            // environment_variables=self.get_build_env_vars(ecr_repo)) fixme
            environmentVariables:
            {
                REPOSITORY_URI: { value: ecr_repo.repositoryUri },
                DOCKERHUB_USERNAME: { value: '/springboot-multiarch/dockerhub/username', type: BuildEnvironmentVariableType.PARAMETER_STORE},
                DOCKERHUB_PASSWORD: { value: '/springboot-multiarch/dockerhub/password', type: BuildEnvironmentVariableType.PARAMETER_STORE },
                REDIS_HOST: { value: props?.redisCluster.attrRedisEndpointAddress},
                REDIS_PORT: { value: props?.redisCluster.attrRedisEndpointPort},
                RDS_SECRET:  { value: props?.rds.secret?.secretName},
                RDS_HOST: {value: props?.rds.clusterEndpoint.hostname},
                RDS_PORT: {value: props?.rds.clusterEndpoint.port},
                EKS_NAME: {value:props?.eksCluster.clusterName},
                EKS_ROLE: {value:props?.eksCluster.kubectlRole?.roleArn},
            },
        })
        this.add_role_access_to_build(post_build);

        // create pipeline
        const source_output = new Artifact()
        const arm_build_output = new Artifact("ARMBuildOutput");
        const amd_build_output = new Artifact("AMDBuildOutput");
        const post_build_output = new Artifact("PostBuildOutput");

        new Pipeline(this, "Pipeline", {
            stages: [
                {
                    stageName: "Source",
                    actions: [
                        new CodeCommitSourceAction({
                            actionName: "CodeCommit_Source",
                            repository: code,
                            output: source_output
                        })]
                },
                {
                    stageName: "Build",
                    actions: [
                        new CodeBuildAction({
                            actionName: "ARM_Build",
                            project: arm_build,
                            input: source_output,
                            outputs: [arm_build_output]
                        }),
                        new CodeBuildAction({
                            actionName: "AMD_Build",
                            project: amd_build,
                            input: source_output,
                            outputs: [amd_build_output]
                        }),
                    ]
                },
                {
                    stageName: "PostBuild",
                    actions: [
                        new CodeBuildAction({
                            actionName: "Post_Build",
                            project: post_build,
                            input: source_output,
                            outputs: [post_build_output]
                        })
                    ]
                },
            ]
        })
    }

    private add_role_access_to_build(build: PipelineProject) {
        build.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2ContainerRegistryFullAccess"));
        build.role?.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMReadOnlyAccess"));
        build.addToRolePolicy(new PolicyStatement({ actions: ["kms:Decrypt", "kms:GenerateDataKey*"], resources: ["*"] }))
        build.addToRolePolicy(new PolicyStatement(
            { actions: ["eks:DescribeNodegroup", "eks:DescribeFargateProfile", "eks:DescribeUpdate", "eks:DescribeCluster"], resources: ["*"] }
        ))
        build.addToRolePolicy(new PolicyStatement({
            actions: ["sts:AssumeRole"], resources: ["*"]
        }))
    };

    private get_build_env_vars() {
    }
}