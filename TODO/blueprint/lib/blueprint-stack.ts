import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';

import { AwsVpc } from './aws-vpc'

export class BlueprintStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // BlueprintStack/VPCs: Managment-VPC, Development-VPC, Production-VPC
    const awsVpcs = new AwsVpc(this, 'VPCs', {});

    const queue = new sqs.Queue(this, 'BlueprintQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'BlueprintTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));
  }
}
