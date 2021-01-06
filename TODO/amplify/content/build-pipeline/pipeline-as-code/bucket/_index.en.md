+++
title = "Artifacts Bucket"
date = 2019-11-01T15:26:09-07:00
weight = 10
pre = "<b>5.3.1. </b>"
+++

Every Code Pipeline needs an artifacts bucket, also known as Artifact Store. CodePipeline will use this bucket to pass artifacts to the downstream jobs and its also where SAM will upload the artifacts during the build process. 

Let's get started and write the code for creating this bucket:

**Make sure you are editing the pipeline-stack file with _.ts_ extension `sls-api/pipeline/lib/pipeline-stack.ts`**

{{<highlight typescript "hl_lines=3-7 15-16">}}
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
    
  }
}
{{</highlight>}}

Easy right? Now build and deploy the project like you did it earlier: 

```
cd ~/environment/sls-api/pipeline
npm run build
cdk deploy
```

{{% notice info %}}
If you get a build error, check that all the @aws-cdk dependencies in the package.json file have the same version number, if not, fix it, delete the node_modules folder and run npm install. More info: https://github.com/aws/aws-cdk/issues/542#issuecomment-449694450.
{{% /notice %}}
