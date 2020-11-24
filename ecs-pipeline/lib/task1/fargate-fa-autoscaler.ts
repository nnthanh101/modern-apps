import * as core from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";
import * as iam from "@aws-cdk/aws-iam";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as sfn from "@aws-cdk/aws-stepfunctions";
import * as sfn_tasks from "@aws-cdk/aws-stepfunctions-tasks";
import * as sns from "@aws-cdk/aws-sns";

const AWSCLI_LAYER_ARN = "arn:aws:serverlessrepo:us-east-1:903779448426:applications/lambda-layer-awscli";
const AWSCLI_LAYER_VERSION = "1.18.142";

export interface FargateFastAutoscalerProps extends core.StackProps {
  readonly awsCliLayerArn?: string;
  readonly awsCliLayerVersion?: string;
  readonly vpc: ec2.Vpc;
  readonly sg: ec2.SecurityGroup;
  readonly cluster: ecs.Cluster;
  readonly fgService: ecs.FargateService;
  readonly disableScaleIn?: boolean;
  readonly snsTopic?: sns.ITopic;
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
    // const sg = new ec2.SecurityGroup(this, "SharedSecurityGroup", {
    //   vpc: props.vpc,
    // });
    // sg.connections.allowFrom(sg, ec2.Port.allTraffic());

    //sg for HTTP public access
    // const httpPublicSecurityGroup = new ec2.SecurityGroup(
    //   this,
    //   "HttpPublicSecurityGroup",
    //   {
    //     allowAllOutbound: true,
    //     securityGroupName: "HttpPublicSecurityGroup",
    //     vpc: props.vpc,
    //   }
    // );

    const lambdaRole = new iam.Role(this, "lambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });
    lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonECS_FullAccess")
    );
    lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonEC2ReadOnlyAccess")
    );

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: [
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
        ],
      })
    );

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        resources: ["*"],
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
      })
    );

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
      securityGroup: props.sg,
      environment: {
        cluster: props.cluster.clusterName,
        service: props.fgService.serviceName,
        disable_scalein: props.disableScaleIn === false ? "no" : "yes",
        region: this.region,
      },
    });

    // step function
    const wait3 = new sfn.Wait(this, 'Wait 3 Seconds', {
      // time: sfn.WaitTime.secondsPath('$.wait_time')
      time: sfn.WaitTime.duration(core.Duration.seconds(3)),
    });
    const wait60 = new sfn.Wait(this, 'Wait 60 Seconds', {
      time: sfn.WaitTime.duration(core.Duration.seconds(60)),
    });

    const getEcsTasks = new sfn.Task(this, "GetECSTasks", {
      task: new sfn_tasks.InvokeFunction(fargateWatcherFunc),
      resultPath: "$.status",
    });

    const topic =
      props.snsTopic ??
      new sns.Topic(this, `${name}-topic`, {
        topicName: `${core.Stack.of(this).stackName}-${name}`,
      });

    const snsScaleOut = new sfn.Task(this, "SNSScaleOut", {
      task: new sfn_tasks.PublishToTopic(topic, {
        // message: sfn.TaskInput.fromDataAt('$'),
        message: sfn.TaskInput.fromObject({
          "Input.$": "$",
        }),
        subject: "Fargate Start Scaling Out",
      }),
      resultPath: "$.taskresult",
    });

    const svcScaleOut = new sfn.Task(this, "ServiceScaleOut", {
      task: new sfn_tasks.InvokeFunction(
        lambda.Function.fromFunctionArn(
          this,
          "svcScaleOut",
          fargateWatcherFunc.functionArn
        )
      ),
    });

    const isServiceOverloaded = new sfn.Choice(this, "IsServiceOverloaded", {
      inputPath: "$.status",
    });
    const isDone = new sfn.Pass(this, "Done");

    const desire2 = new sfn.Pass(this, "Desire3", {
      outputPath: "$",
      result: sfn.Result.fromObject({ Desired: 3 }),
    });
    // const desire5 = new sfn.Pass(this, 'Desire5', {
    //     outputPath: DISCARD,
    //     result: sfn.Result.fromObject({Desired: 5})
    // })
    const desire10 = new sfn.Pass(this, "Desire4", {
      outputPath: "$",
      result: sfn.Result.fromObject({ Desired: 4 }),
    });
    const desire15 = new sfn.Pass(this, "Desire5", {
      outputPath: "$",
      result: sfn.Result.fromObject({ Desired: 5 }),
    });
    const desire20 = new sfn.Pass(this, "Desire6", {
      outputPath: "$",
      result: sfn.Result.fromObject({ Desired: 6 }),
    });

    const chain = sfn.Chain.start(getEcsTasks).next(
      isServiceOverloaded
        .when(
          sfn.Condition.numberGreaterThanEquals("$.avg", 6),
          desire20.next(
            snsScaleOut.next(svcScaleOut.next(wait60.next(getEcsTasks)))
          )
        )
        .when(
          sfn.Condition.numberGreaterThanEquals("$.avg", 5),
          desire15.next(snsScaleOut)
        )
        .when(
          sfn.Condition.numberGreaterThanEquals("$.avg", 4),
          desire10.next(snsScaleOut)
        )
        .when(
          sfn.Condition.numberGreaterThanEquals("$.avg", 3),
          desire2.next(snsScaleOut)
        )
        // .when(sfn.Condition.numberLessThanEquals('$.avg', 10), desire2
        //     .next(snsScaleOut
        // ))
        .when(sfn.Condition.numberLessThan("$.avg", 1), isDone)
        .otherwise(wait3.next(getEcsTasks))
    );

    new sfn.StateMachine(this, "FargateFastAutoscaler", {
      definition: chain,
      timeout: core.Duration.hours(24),
    });

    new core.CfnOutput(this, "ClusterARN: ", { value: props.cluster.clusterArn });
    new core.CfnOutput(this, "FargateWatcherLambdaArn: ", {
      value: fargateWatcherFunc.functionArn,
    });
    // aws ecs list-tasks --service-name EcsPipelineStack-FargateService7DD58861-ZgsaBmxzHwmQ --cluster AppEcsCluster --query "taskArns" --output text | sed -e 's/\t/ /g'
    // aws ecs describe-tasks --cluster AppEcsCluster --tasks arn:aws:ecs:ap-southeast-1:603558237504:task/AppEcsCluster/0a2bca8bfa4c4e15b1de588c8e4b4781 --query "tasks[?lastStatus=='RUNNING'].attachments[0].details[-1].value" --output text
    // curl -s --max-time 5 http://10.0.1.145/nginx_status | grep ^Act | awk '{print $NF}'
    // curl -s --max-time 5 http://ecs-loadbalancer-1325295757.ap-southeast-1.elb.amazonaws.com/nginx_status | grep ^Act | awk '{print $NF}'
    // for ((i=1;i<=10000;i++)); do   curl -v --header "Connection: keep-alive" "http://ecs-loadbalancer-1325295757.ap-southeast-1.elb.amazonaws.com/nginx_status"; done
  }
}
