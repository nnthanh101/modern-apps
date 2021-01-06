+++
title = "Push the Code"
weight = 30
pre= "<b>5.1.3. </b>"
+++

### Ignore the build artifacts
Copy and paste the following lines at the end of the `sls-api/.gitgnore` file. There is no need to track the  .aws-sam directory or the packaged.yaml under version control as they are re-generated on every build. 

```
.aws-sam/
packaged.yaml
```

In Cloud9, remember to enable hidden files: 

![EnableHiddenFiles](/images/build-pipeline/screenshot-hidden-files-cloud9.png)

Open the `.gitignore` file and paste the two lines described above. 

From the root directory of your _sls-api_ project, run the following commands:

```
cd ~/environment/sls-api
git init
git add .
git commit -m "Initial commit"
```

### Push the code
Add your CodeCommit repository URL as a _remote_ on your local git project. This is the `cloneUrlHttp` value that you got back after creating the repository in Step 1 of this chapter.

{{% notice tip %}}
If you can't find the CodeCommit repository URL, you can find it by running this command: `aws codecommit get-repository --repository-name sls-api`.
{{% /notice %}}

```
git remote add origin REPLACE_WITH_HTTP_CLONE_URL

# git remote set-url origin https://git-codecommit.ap-southeast-1.amazonaws.com/v1/repos/sls-api
```

{{% notice tip %}}
If you typed the origin url incorrectly, you can remove it by running: `git remote rm origin`.
{{% /notice %}}

Now, push the code:

```
git push -u origin master
```

### Verify in CodeCommit
Navigate to the [AWS CodeCommit console](https://console.aws.amazon.com/codesuite/codecommit/home), find your _sls-api_ repository and click on it to view its contents. Make sure your code is there. You should see a screen like the following:

![VerifyCodeCommit](/images/build-pipeline/screenshot-verify-codecommit.png)