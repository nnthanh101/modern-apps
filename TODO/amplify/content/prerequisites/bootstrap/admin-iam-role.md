---
title: "IAM Role for Cloud9"
chapter: false
weight: 10
# pre: "<b>3.1. </b>"
---

### 1. IAM Role for your Cloud9 IDE

1. Follow [this deep link to create an IAM role with Administrator access.](https://console.aws.amazon.com/iam/home#/roles$new?step=review&commonUseCase=EC2%2BEC2&selectedUseCase=EC2&policies=arn:aws:iam::aws:policy%2FAdministratorAccess&roleName=admin-role)
2. Confirm that **AWS service** and **EC2** are selected, then click **Next** to view permissions.
3. Confirm that **AdministratorAccess** is checked, then click **Next: Tags** to assign tags.
4. Take the defaults, and click **Next: Review** to review.
5. Enter `admin-role` for the Name, and click **Create role**.

### 2. Attach the IAM Role to Cloud9

1. Follow [this deep link to find your Cloud9 EC2 instance](https://console.aws.amazon.com/ec2/v2/home?#Instances:tag:Name=aws-cloud9-.*;sort=desc:launchTime)
2. Select the instance, then choose **Actions / Instance Settings / Attach/Replace IAM Role**
![c9instancerole](/images/prerequisites/c9instancerole.png)
3. Choose `admin-role` from the **IAM Role** drop down, and select **Apply**

### 3. Update IAM settings for Cloud9

{{% notice info %}}
Cloud9 normally manages IAM credentials dynamically. This isn't currently compatible with the EKS IAM authentication, so we will disable it and rely on the IAM role instead.
{{% /notice %}}

- Return to your workspace and click the gear icon (in top right corner), or click to open a new tab and choose "Open Preferences"
- Select **AWS SETTINGS**
- Turn off **AWS managed temporary credentials**
- Close the Preferences tab
![c9disableiam](/images/prerequisites/c9disableiam.png)

To ensure temporary credentials aren't already in place we will also remove
any existing credentials file:
```sh
rm -vf ${HOME}/.aws/credentials
```