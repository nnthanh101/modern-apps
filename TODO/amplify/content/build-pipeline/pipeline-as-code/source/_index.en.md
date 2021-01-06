+++
title = "Source Stage"
weight = 20
pre = "<b>5.3.2. </b>"
+++

The **Source Stage** is the first step of any CI/CD pipeline and it represents your source code. This stage is in charge of triggering the pipeline based on new code changes (i.e. git push or pull requests). In this workshop, we will be using AWS CodeCommit as the source provider, but CodePipeline also supports S3, GitHub and Amazon ECR as source providers.

Append the following code snippet after your bucket definition in the `sls-api/pipeline/lib/pipeline-stack.ts`** file:

{{<highlight typescript "hl_lines=18-44">}}
import * as cdk from '@aws-cdk/core';

import s3 = require('@aws-cdk/aws-s3');
import codecommit = require('@aws-cdk/aws-codecommit');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');
import codebuild = require('@aws-cdk/aws-codebuild');

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    
    /** Step 1: */
    const artifactsBucket = new s3.Bucket(this, "ArtifactsBucket");
    
    /** Step 2: */
    // Import existing CodeCommit sls-api repository
    const codeRepo = codecommit.Repository.fromRepositoryName(
      this,
      'AppRepository', // Logical name within CloudFormation
      'sls-api'    // Repository name
    );
    
    // Pipeline creation starts
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      artifactBucket: artifactsBucket
    });
    
    // Declare source code as an artifact
    const sourceOutput = new codepipeline.Artifact();
    
    // Add source stage to pipeline
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.CodeCommitSourceAction({
          actionName: 'CodeCommit_Source',
          repository: codeRepo,
          output: sourceOutput,
        }),
      ],
    });

  }
}
{{</highlight>}}

Since we already have the CodeCommit repository, we don't need to create a new one, we just need to import it using the repository name. 

Also notice how we define an object `sourceOutput` as a pipeline artifact; This is necessary for any files that you want CodePipeline to pass to downstream stages. In this case, we want our source code to be passed to the Build stage.

{{% notice info %}}
Don't do a `cdk deploy` just yet, because a pipeline needs to have at least 2 stages to be created. Lets continue to the next page to add a Build stage first.
{{% /notice%}}
