+++
title = "Configure Credentials"
weight = 22
pre= "<b>5.1.2. </b>"
+++

One of the cool things about CodeCommit is the support for IAM authentication. And if you are running this workshop from a Cloud9 workspace, you can leverage the fact that your terminal is already pre-authenticated with valid AWS credentials.

Run the following commands from your terminal: 

```bash
git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true
```

Now configure the git client with username and email, so your commits have an author defined.

```
git config --global user.name "Replace with your name"
git config --global user.email "replace_with_your_email@example.com"
```

Example:

```bash
git config --global user.name "Thanh Nguyen"
git config --global user.email "nnthanh101@gmail.com"
```