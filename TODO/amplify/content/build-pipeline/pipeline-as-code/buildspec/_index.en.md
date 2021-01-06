+++
title = "Buildspec file"
weight = 40
pre = "<b>5.3.4. </b>"
+++

A **[Buildspec File](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html)** is a series of commands in YAML format that CodeBuild executes to build your application. This file is placed in the root folder of a SAM application and CodeBuild will automatically find it and run it during build time.

In your Cloud9 editor, create a new file named `buildspec.yml` in the root (top level) of the _sls-api_ directory by right clicking on the `sls-api` folder and selecting New file.

{{% notice tip %}}
The extension of the file can be either `yml` or `yaml`, CodeBuild will find it either way.
{{% /notice%}}

Then, paste the following content into the `~/environment/sls-api/buildspec.yml` file:

```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      python: 3.7
    commands:
      # Install packages or any pre-reqs in this phase.
      # Upgrading SAM CLI to latest version
      - pip3 install --upgrade aws-sam-cli
      - sam --version
      # Installing project dependencies
      - cd hello_world
      - pip install -r requirements.txt
  
  pre_build:
    commands:
      # Run tests, lint scripts or any other pre-build checks.
      - cd ..
      - pip install pytest pytest-mock --user
      - python -m pytest tests/ -v

  build:
    commands:
      # Use Build phase to build your artifacts (compile, etc.)
      - sam build

  post_build:
    commands:
      # Use Post-Build for notifications, git tags, upload artifacts to S3
      - sam package --s3-bucket $PACKAGE_BUCKET --output-template-file packaged.yaml

artifacts:
  discard-paths: yes
  files:
    # List of local artifacts that will be passed down the pipeline
    - packaged.yaml
```

**Save the file**. 

{{%expand "✍️ CDK buildspec.yml" %}}
```yaml
version: 0.2
phases:
  install:
    runtime-versions:
      python: 3.8
    commands:
      ## Install packages or any pre-reqs in this phase.
      - npm install -g aws-cdk
      ## Installing project dependencies
      - pip install -r requirements.txt
  
  pre_build:
    commands:
      ## Run tests, lint scripts or any other pre-build checks.
      - pip install pytest pytest-mock --user
      - python -m pytest tests/ -v

  build:
    commands:
      ## Use Build phase to build your artifacts (compile, etc.)
      - cdk synth > packaged.yaml

  post_build:
    commands:
      ## Use Post-Build for notifications, git tags, upload artifacts to S3
      # - sam package --s3-bucket $PACKAGE_BUCKET --output-template-file packaged.yaml
      - ls

artifacts:
  discard-paths: yes
  files:
    ## List of local artifacts that will be passed down the pipeline
    - packaged.yaml
```
{{% /expand%}}

### Push code changes

Commit your changes and push them to the repository.

```
cd ~/environment/sls-api
git add .
git commit -m "Added buildspec.yml"
git push
```

### Verify build succeeds

Navigate to your CodePipeline again, and wait for it to trigger automatically. This time the build will succeed: 

![BuildSucceeds](/images/build-pipeline/pipeline-verify-success.png)