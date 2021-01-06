+++
title = "EKS Container Stack"
weight = 20
pre= "<b>2.2. </b>"
+++


> 🎯 We'll add a **EKS Cluster** with an **API-Gateway Endpoint** in front of it.

![Container Stack Architecture](/images/container-typescript/container-stack.png)

{{%expand "✍️ The key Goals/Outcomes from EKS" %}}
* What type of workloads will you be deploying on **Kubernetes**? 
  * Migrate legacy Apps to Cloud
  * Micro-Services / Cloud Native development
  * Batch processing 
  * Hybrid Container deployments 

* What Cloud Services will your workloads need to integrate with?

* What is your development teams maturity in **DevOps**?

{{% /expand%}}

> 🎯 Install the related Construct Library

```
npm install --save dotenv @aws-cdk/aws-iam @aws-cdk/aws-eks @aws-cdk/aws-ec2 @aws-cdk/aws-autoscaling @aws-cdk/aws-ecr @aws-cdk/aws-codecommit @aws-cdk/aws-codebuild @aws-cdk/aws-events-targets @aws-cdk/aws-codepipeline @aws-cdk/aws-codepipeline-actions
```
