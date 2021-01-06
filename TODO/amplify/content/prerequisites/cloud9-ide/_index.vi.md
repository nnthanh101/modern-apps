---
title: "Provisioning Cloud9"
chapter: false
weight: 20
pre: "<b>2. </b>"
---

🔥 **AWS Cloud9 IDE**: code editor, debugger, and terminal; seamlessly sharing development environment.

> **Step 1**. Log into the [**AWS Console**](https://console.aws.amazon.com)

- [Create a Cloud9 Environment](https://ap-southeast-1.console.aws.amazon.com/cloud9/home?region=ap-southeast-1)
- Select **Create environment**
- Name it **`Cloud9`**, and select **Next Step**
- Stick with the default settings, and select **Next Step**: 
    - [x] `t3.micro`
    - [x] `Amazon Linux`
    - [ ] ~~Ubuntu Server 18.04 LTS~~
- Lastly, select **Create Environment**
- When it comes up, customize the environment by closing the **welcome tab**
and **lower work area**, and opening a new **terminal** tab in the main work area

> **Step 2**. Cloud9 Themes

If you like this theme, you can choose it yourself by selecting **View / Themes / Solarized / Solarized Dark**
in the Cloud9 workspace menu.

{{% notice warning %}}
The Cloud9 workspace should be built by an IAM user with Administrator privileges,
not the root account user. Please ensure you are logged in as an IAM user, not the root account user.
{{% /notice %}}

{{% notice tip %}}
Ad blockers, javascript disablers, and tracking blockers should be disabled for
the Cloud9 domain, or connecting to the workspace might be impacted.
Cloud9 requires third-party-cookies. You can whitelist the [specific domains]( https://docs.aws.amazon.com/cloud9/latest/user-guide/troubleshooting.html#troubleshooting-env-loading).
{{% /notice %}}