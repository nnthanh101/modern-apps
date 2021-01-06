+++
title = "Monitor Canary Health"
weight = 23
+++

Canary deployments are considerably more successful if the code is being monitored during the deployment. You can configure CodeDeploy to automatically roll back the deployment if a specified CloudWatch metric has breached the alarm threshold. Common metrics to monitor are Lambda Invocation errors or Invocation Duration (latency), for example.

### Define a CloudWatch Alarm

Add the following alarm definition to the `sls-api/template.yaml` file in the _Resources_ section after the _HelloWorldFunction_ definition. 

```
CanaryErrorsAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmDescription: Lambda function canary errors
    ComparisonOperator: GreaterThanThreshold
    EvaluationPeriods: 2
    MetricName: Errors
    Namespace: AWS/Lambda
    Period: 60
    Statistic: Sum
    Threshold: 0
    Dimensions:
      - Name: Resource
        Value: !Sub "${HelloWorldFunction}:live"
      - Name: FunctionName
        Value: !Ref HelloWorldFunction
      - Name: ExecutedVersion
        Value: !GetAtt HelloWorldFunction.Version.Version
```

And then add the following lines to the _DeploymentPreference_ section of the _HelloWorldFunction_ definition. 

```
Alarms:
    - !Ref CanaryErrorsAlarm
```

Your `template.yaml` should look like this:  

{{<highlight yaml "hl_lines=20-21 29-46">}}
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
          Alarms:
          - !Ref CanaryErrorsAlarm
      Events:
        HelloWorld:
          Type: Api # More info about API Event Source: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
          Properties:
            Path: /hello
            Method: get

  CanaryErrorsAlarm:
    Type: AWS::CloudWatch::Alarm
    Properties:
      AlarmDescription: Lambda function canary errors
      ComparisonOperator: GreaterThanThreshold
      EvaluationPeriods: 2
      MetricName: Errors
      Namespace: AWS/Lambda
      Period: 60
      Statistic: Sum
      Threshold: 0
      Dimensions:
        - Name: Resource
          Value: !Sub "${HelloWorldFunction}:live"
        - Name: FunctionName
          Value: !Ref HelloWorldFunction
        - Name: ExecutedVersion
          Value: !GetAtt HelloWorldFunction.Version.Version


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
git commit -m "Added CloudWatch alarm to monitor the canary"
git push
```