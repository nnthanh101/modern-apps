+++
title = "Build the CI/CD Pipeline"
weight = 50
chapter = true
pre = "<b>5. </b>"
+++

# Build the pipeline

In this chapter you are going to learn how to automate the build, package and deploy commands by creating a continous delivery pipeline using AWS Code Pipeline. 

![SimplePipeline](/images/build-pipeline/pipeline-art.png)

The services used in this chapter are CodeCommit, CodeBuild, CodePipeline, CloudFormation and the AWS CDK.

```bash
cp -avr sls-app/demo/sam-app/ .

cd ~/environment/sam-app
```