# Welcome to ECS-Fargate CDK TypeScript project!

This is a boilerplate project for TypeScript development with CDK.


* [ ] Step 0. Configuring Cloud9
    * [ ] https://devsecops.job4u.io/en/prerequisites/bootstrap/
    * [ ] `./cloud9.sh`

* [ ] Step 1. Build & Test Docker
    * [ ] https://devsecops.job4u.io/en/ecs/build-test-docker/
    * [ ] `./deploy-docker-ecr.sh`

* [ ] Step 2. Deploy with Amazon ECS Fargate
    * [ ] https://devsecops.job4u.io/en/ecs/deploy-with-fargate/
    * [ ] `./deploy.sh`

* [ ] Step 3. Scale with Load Balancer
    * ALB: [ ] https://devsecops.job4u.io/en/ecs/scale-with-load-balancer/
    * API-Gateway & NLB: **Deploy a SpringBoot application using AWS CDK.docx**

* [ ] Step 4. Deploy Micro-Services
    * [ ] NodeJS
    * [ ] React
    * [ ] SpringBoot
    * [ ] Go

* [ ] Step 5. CI/CD Pipeline
    * [ ] **CICD Pipeline using CDK.docx**


The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
