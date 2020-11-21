import * as core from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";
import * as iam from "@aws-cdk/aws-iam";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";

const AWSCLI_LAYER_ARN =
  "arn:aws:serverlessrepo:ap-southeast-1:685258696228:applications/lambda-layer-awscli";
const AWSCLI_LAYER_VERSION = "1.16.281";

export interface FargateFastAutoscalerProps extends core.StackProps {
  readonly awsCliLayerArn: string;
  readonly awsCliLayerVersion: string;
  readonly vpc: ec2.Vpc;
  readonly cluster: ecs.Cluster;
  readonly fgService: ecs.FargateService;
  readonly disableScaleIn?: boolean;
}

export class FargateFastAutoscalerStack extends core.Stack {
  public readonly layerVersionArn: string;
  constructor(
    parent: core.App,
    name: string,
    props: FargateFastAutoscalerProps
  ) {
    super(parent, name, {
      ...props,
    });
    
    // create a security group that allows all traffic from the same sg
    const sg = new ec2.SecurityGroup(this, 'SharedSecurityGroup', {
      vpc: props.vpc,
    });
    sg.connections.allowFrom(sg, ec2.Port.allTraffic());


    //sg for HTTP public access
    const httpPublicSecurityGroup = new ec2.SecurityGroup(this, 'HttpPublicSecurityGroup', {
      allowAllOutbound: true,
      securityGroupName: 'HttpPublicSecurityGroup',
      vpc: props.vpc,
    });
    
    const lambdaRole = new iam.Role(this, 'lambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonECS_FullAccess'));
    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ReadOnlyAccess'));

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        'ec2:CreateNetworkInterface',
        'ec2:DescribeNetworkInterfaces',
        'ec2:DeleteNetworkInterface',
      ],
    }));


    lambdaRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
    }));

    core.Stack.of(this).templateOptions.transforms = [
      "AWS::Serverless-2016-10-31",
    ]; // required for AWS::Serverless

    const resource = new core.CfnResource(this, "Resource", {
      type: "AWS::Serverless::Application",
      properties: {
        Location: {
          ApplicationId: props.awsCliLayerArn ?? AWSCLI_LAYER_ARN,
          SemanticVersion: props.awsCliLayerVersion ?? AWSCLI_LAYER_VERSION,
        },
        Parameters: {},
      },
    });

    this.layerVersionArn = core.Token.asString(
      resource.getAtt("Outputs.LayerVersionArn")
    );

    const fargateWatcherFunc = new lambda.Function(this, "fargateWatcherFunc", {
      runtime: lambda.Runtime.PROVIDED,
      handler: "main",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../../sam/fargateWatcherFunc/func.d")
      ),
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(
          this,
          "AwsCliLayer",
          this.layerVersionArn
        ),
      ],
      memorySize: 1024,
      timeout: core.Duration.minutes(1),
      role: lambdaRole,
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE },
      securityGroup: sg,
      environment: {
        cluster: props.cluster.clusterName,
        service: props.fgService.serviceName,
        disable_scalein: props.disableScaleIn === false ? "no" : "yes",
        region: this.region,
      },
    });
  }
}
