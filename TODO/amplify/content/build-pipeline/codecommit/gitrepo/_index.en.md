+++
title = "Create a Git Repository"
weight = 10
pre= "<b>5.1.1. </b>"
+++

Any CI/CD pipeline starts with a code repository. In this workshop we use AWS CodeCommit for ease of integration, but you could use other source code integrations, like GitHub for example. 

Run the following command from your terminal to create a new CodeCommit repository:

```
aws codecommit create-repository --repository-name sls-api
```

✍️ You should see the following output. Copy the value of `cloneUrlHttp`, you will need it later.

{{<highlight json "hl_lines=8">}}
{
    "repositoryMetadata": {
        "accountId": "111111111111",
        "repositoryId": "ab66211f-fe79-4f0c-8b8f-937c73ff380f",
        "repositoryName": "sls-api",
        "lastModifiedDate": 1589626684.833,
        "creationDate": 1589626684.833,
        "cloneUrlHttp": "https://git-codecommit.ap-southeast-1.amazonaws.com/v1/repos/sls-api",
        "cloneUrlSsh": "ssh://git-codecommit.ap-southeast-1.amazonaws.com/v1/repos/sls-api",
        "Arn": "arn:aws:codecommit:ap-southeast-1:701571471198:sls-api"
    }
}
{{</highlight>}}