+++
title = "Rollbacks"
date = 2019-11-12T08:00:36-08:00
weight = 30
+++

Monitoring the health of your canary allows CodeDeploy to make a decision to whether a rollback is needed or not. If any of the CloudWatch Alarms specified gets to ALARM status, CodeDeploy rollsback the deployment automatically. 

### Introduce an error on purpose

Lets break the Lambda function on purpose so that the _CanaryErrorsAlarm_ gets triggered during deployment. Update the lambda code in `sls-api/hello_world/app.py` to throw an error on every invocation, like this:

{{<highlight python "hl_lines=9">}}
    # return {
    #     "statusCode": 200,
    #     "body": json.dumps({
    #         "message": "hello world",
    #         # "location": ip.text.replace("\n", "")
    #     }),
    # }
    
    raise SystemExit('This will cause a deployment rollback!')
{{</highlight>}} 

Make sure to update the unit test, otherwise the build will fail. Comment out every line in the `sls-api/buildspec.yml` file: 

{{<highlight yaml "hl_lines=6">}}
  pre_build:
    commands:
      # Run tests, lint scripts or any other pre-build checks.
      - cd ..
      - pip install pytest pytest-mock --user
      # - python -m pytest tests/ -v
{{</highlight>}} 

### Push the changes

In the terminal, run the following commands from the root directory of your `sls-api` project.

```
git add .
git commit -m "Breaking the lambda function for CodeDeploy Rollback purpose"
git push
```