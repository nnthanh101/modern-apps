+++
title = "Pipeline as Code"
weight = 30
pre= "<b>5.3. </b>"
+++

Open the file `lib/pipeline-stack.ts` in your Cloud9 workspace. 

### Build the CDK project

Even though we haven't wrote any code yet, let's get familiar with how to build and deploy a CDK project, as you will be doing it multiple times in this workshop and you should get comfortable with the process. Start by building the project with the following command: 

```
cd ~/environment/sls-api/pipeline
npm install
npm run build
```

### Deploy a CDK project

After the build has finished, go ahead and deploy the pipeline project by using the CDK CLI:

```
cdk deploy
```

A new CloudFormation stack was created in your account, but because your CDK project is empty, the only resource that was created was an AWS::CDK::Metadata. If you check your [CloudFormation Console](https://console.aws.amazon.com/cloudformation/home), you will see the new stack and the metadata resource. 

![CdkMetadata](/images/build-pipeline/cicd-cloudformation.png)