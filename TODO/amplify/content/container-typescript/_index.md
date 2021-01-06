+++
title = "Launch an EKS Cluster"
weight = 20
pre= "<b>2. </b>"
+++


![Launch & Configure an EKS Cluster](/images/container-typescript/cdk-eks-architecture.png?width=50pc)

{{%expand "✍️ Why Elastic Kubernetes Service (EKS) on AWS" %}}
* Enterprise Class Platform to run **Production-Grade** workloads. [Rapid innovation based on our customer needs](https://github.com/aws/containers-roadmap/projects/1)

* **Native & Upstream Kubernetes** experience. Flexibility over your *Container* build including bring your own *AMI*, *VPC*, *Nodes* (*Spot*, *GPU* etc.), *IAM*, *Logging*, *Monitoring* and *Storage* etc.

* **Seamless Integrations** with AWS services, allowing our Customers to gain long term benefits around *cost*, *time to market* and *Developer productivity*.

* Actively contributes to the **CNCF Kubernetes Community**

{{% /expand%}}


To provision a ready-to-use **Amazon EKS** cluster by simply `cdk deploy` with **AWS Cloud Development Kit**.

### 🎯 To run a the CDK TypeScript

* [x] ~~Prerequisites~~: [Quick-Setup Cloud9](../prerequisites/bootstrap/)

    ```
    # npm install -g aws-cdk --force
    cdk --version

    # git clone the project
    git clone https://github.com/nnthanh101/eks-workshop.git
    ```

* [x] Deploy **EksClusterStack** in a new **VPC** (default)

    ```
    cd ~/environment/eks-workshop/eks-cluster

    # install other required npm modules
    npm install
    npm run build

    cdk synth

    # cdk bootstrapping (only required for the 1st time)
    cdk bootstrap aws://$ACCOUNT_ID/$AWS_REGION

    # cdk diff to see what will be created
    cdk diff

    cdk deploy
    ```

{{% children showhidden="false" %}}