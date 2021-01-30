import * as core from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";
import * as iam from "@aws-cdk/aws-iam";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as sfn from "@aws-cdk/aws-stepfunctions";
import * as sfn_tasks from "@aws-cdk/aws-stepfunctions-tasks";
import * as sns from "@aws-cdk/aws-sns";

import { applicationMetaData } from "../configurations/config";

// const AWSCLI_LAYER_ARN = "arn:aws:serverlessrepo:us-east-1:903779448426:applications/lambda-layer-awscli";
// const AWSCLI_LAYER_VERSION = "1.18.142";

export interface FargateAutoscalerProps extends core.StackProps {
  readonly vpc: ec2.IVpc;
  readonly cluster: ecs.Cluster;
  readonly fgService: ecs.FargateService;
  readonly scaleType: string;
  readonly awsCliLayerArn?: string;
  readonly awsCliLayerVersion?: string;
  readonly disableScaleIn?: boolean;
  readonly snsTopic?: sns.ITopic;
  readonly timeout ?: core.Duration;
}

export class FargateAutoscalerStack extends core.Stack {
  constructor(
    parent: core.Construct,
    name: string,
    props: FargateAutoscalerProps
  ) {
    super(parent, name, {
      ...props,
    });
    
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
          ApplicationId: props.awsCliLayerArn ,
          SemanticVersion: props.awsCliLayerVersion ,
        },
        Parameters: {},
      },
    });

    let layerVersionArn = core.Token.asString(
      resource.getAtt("Outputs.LayerVersionArn")
    );
    
    // create a security group that allows all traffic from the same sg
    const sg = new ec2.SecurityGroup(this, 'SharedSecurityGroup', {
      vpc: props.vpc,
    });
    sg.connections.allowFrom(sg, ec2.Port.allTraffic());
    
    if (props.scaleType == 'Connection') {
    
      const fargateWatcherFunc = new lambda.Function(this, "fargateWatcherFunc", {
        runtime: lambda.Runtime.PROVIDED,
        handler: "main",
        code: lambda.Code.fromAsset(
          path.join(__dirname, "../sam/fargateWatcherFunc/func.d")
        ),
        layers: [
          lambda.LayerVersion.fromLayerVersionArn(
            this,
            "AwsCliLayer",
            layerVersionArn
          ),
        ],
        memorySize: 1024,
        timeout: core.Duration.minutes(1),
        role: lambdaRole,
        vpc: props.vpc,
        // FIXME
        // vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE },
        securityGroup: sg,
        environment: {
          cluster: props.cluster.clusterName,
          service: props.fgService.serviceName,
          disable_scalein: props.disableScaleIn === false ? "no" : "yes",
          region: this.region,
        },
      });
  
      // step function
      const wait3 = new sfn.Wait(this, "Wait " + applicationMetaData.timeToNextChecker + " Seconds", {
        // time: sfn.WaitTime.secondsPath('$.wait_time')
        time: sfn.WaitTime.duration(core.Duration.seconds(applicationMetaData.timeToNextChecker)),
      });
      const wait60 = new sfn.Wait(this, "Wait "+ applicationMetaData.waitForSacleDone + " Seconds", {
        time: sfn.WaitTime.duration(core.Duration.seconds(applicationMetaData.waitForSacleDone)),
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
      
      let desireLv1 = applicationMetaData.desireLv1.split("_");
      let desireLv2 = applicationMetaData.desireLv2.split("_");
      let desireLv3 = applicationMetaData.desireLv3.split("_");
      let desireLv4 = applicationMetaData.desireLv4.split("_");
      let desireDone = Number (applicationMetaData.desireDone);
      
      
      const isServiceOverloaded = new sfn.Choice(this, "IsServiceOverloaded", {
        inputPath: "$.status",
      });
      const isDone = new sfn.Pass(this, "Done");
  
      const desire_lv1 = new sfn.Pass(this, "Desire" + desireLv1[1], {
        outputPath: "$",
        result: sfn.Result.fromObject({ Desired: desireLv1[1] }),
      });
      const desire_lv2 = new sfn.Pass(this, "Desire" + desireLv2[1], {
        outputPath: "$",
        result: sfn.Result.fromObject({ Desired: desireLv2[1] }),
      });
      const desire_lv3 = new sfn.Pass(this, "Desire" + desireLv3[1], {
        outputPath: "$",
        result: sfn.Result.fromObject({ Desired: desireLv3[1] }),
      });
      const desire_lv4 = new sfn.Pass(this, "Desire" + desireLv4[1], {
        outputPath: "$",
        result: sfn.Result.fromObject({ Desired: desireLv4[1] }),
      });
  
      const chain = sfn.Chain.start(getEcsTasks).next(
        isServiceOverloaded
          .when(
            sfn.Condition.numberGreaterThanEquals("$.avg", Number(desireLv4[0])),
            desire_lv4.next(
              snsScaleOut.next(svcScaleOut.next(wait60.next(getEcsTasks)))
            )
          )
          .when(
            sfn.Condition.numberGreaterThanEquals("$.avg", Number(desireLv3[0])),
            desire_lv3.next(snsScaleOut)
          )
          .when(
            sfn.Condition.numberGreaterThanEquals("$.avg", Number(desireLv2[0])),
            desire_lv2.next(snsScaleOut)
          )
          .when(
            sfn.Condition.numberGreaterThanEquals("$.avg", Number(desireLv1[0])),
            desire_lv1.next(snsScaleOut)
          )
          // .when(sfn.Condition.numberLessThanEquals('$.avg', 10), desire2
          //     .next(snsScaleOut
          // ))
          .when(sfn.Condition.numberGreaterThanEquals("$.avg", desireDone), isDone)
          .otherwise(wait3.next(getEcsTasks))
      );
  
      new sfn.StateMachine(this, "FargateAutoscaler", {
        definition: chain,
        timeout: core.Duration.hours(24),
      });
  
      new core.CfnOutput(this, "ClusterARN: ", {
        value: props.cluster.clusterArn,
      });
      new core.CfnOutput(this, "FargateWatcherLambdaArn: ", {
        value: fargateWatcherFunc.functionArn,
      });
    }
    
    if (props.scaleType == 'Ram') {
      // Todo function sacling by Ram
    }
    
    if (props.scaleType == 'CPU') {
      // Todo function sacling by cpu
    }
    
  }
}