+++
title = "Update SAM template"
date = 2019-11-11T14:46:02-08:00
weight = 15
+++

Open the SAM template (`sls-api/template.yaml`) in your project and add the following lines to the HelloWorldFunction properties section. 

```
AutoPublishAlias: live
DeploymentPreference:
    Type: Canary10Percent5Minutes
```

It should look like this:  
**PLEASE CHECK THE CORRECT INDENTATION, IT IS VERY IMPORTANT IN YAML FORMAT.**

{{<highlight yaml "hl_lines=17-19">}}
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: SAM Template for sls-api

# More info about Globals: https://github.com/awslabs/serverless-application-model/blob/master/docs/globals.rst
Globals:
  Function:
    Timeout: 3

Resources:
  HelloWorldFunction:
    Type: AWS::Serverless::Function # More info about Function Resource: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction
    Properties:
      CodeUri: hello_world/
      Handler: app.lambda_handler
      Runtime: python3.7
      AutoPublishAlias: live
      DeploymentPreference:
          Type: Canary10Percent5Minutes
      Events:
        HelloWorld:
          Type: Api # More info about API Event Source: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
          Properties:
            Path: /hello
            Method: get

Outputs:
  # ServerlessRestApi is an implicit API created out of Events key under Serverless::Function
  # Find out more about other implicit resources you can reference within SAM
  # https://github.com/awslabs/serverless-application-model/blob/master/docs/internals/generated_resources.rst#api
  HelloWorldApi:
    Description: "API Gateway endpoint URL for Prod stage for Hello World function"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/hello/"
  HelloWorldFunction:
    Description: "Hello World Lambda Function ARN"
    Value: !GetAtt HelloWorldFunction.Arn
  HelloWorldFunctionIamRole:
    Description: "Implicit IAM Role created for Hello World function"
    Value: !GetAtt HelloWorldFunctionRole.Arn
{{</highlight>}}

### Deployment Preference Types

For this workshop, we are using the _Canary10Percent5Minutes_ strategy, which means that traffic is shifted in two increments. In the first increment, only 10% of the traffic is shifted to the new Lambda version, and after 5 minutes, the remaining 90% is shifted. There are other deployment strategies you can choose in CodeDeploy:

- Canary10Percent30Minutes
- Canary10Percent5Minutes
- Canary10Percent10Minutes
- Canary10Percent15Minutes
- Linear10PercentEvery10Minutes
- Linear10PercentEvery1Minute
- Linear10PercentEvery2Minutes
- Linear10PercentEvery3Minutes
- AllAtOnce

The _Linear_ strategy means that traffic is shifted in equal increments with an equal number of time interval between each increment.

### Validate the SAM template
Run the following command on your terminal: 

```
cd ~/environment/sls-api
sam validate
```

If the template is correct, you will see `template.yaml is a valid SAM Template`. If you see an error, then you likely have an indentation issue on the YAML file. Double check and make sure it matches the screenshot shown above.

### Push the changes

In the terminal, run the following commands from the root directory of your `sls-api` project.

```
git add .
git commit -m "Canary deployments with SAM"
git push
```