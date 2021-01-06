+++
title = "CDK8s with TypeScript"
weight = 10
pre= "<b>3.1. </b>"
+++


Let's walk through a basic Web-Application **PodInfo** in TypeScript.

## Prerequisites

 - [Node.js >= 10.x](https://nodejs.org/en/)
 - Your favorite editor/IDE
 - [yarn](https://yarnpkg.com/) (optional)

## Install the CLI

cdk8s has a cute little CLI that has a few useful commands. Let's start by
installing the cdk8s CLI globally:

```shell
npm install -g cdk8s-cli
```

## New Project

Now, we'll use the `cdk8s init` command to create a new TypeScript cdk8s app:

```console
mkdir podinfo
cd podinfo

cdk8s init typescript-app
```

This will perform the following:

1. Create a new project directory
2. Install cdk8s as a dependency
3. Import all Kubernetes API objects
4. Compile the TypeScript to JavaScript

### Watch

Since TypeScript is a compiled language, we will need to compile `.ts` files to
`.js` in order to execute our CDK app. You can do that continuously in the
background like this:

```shell
npm run watch
```

### Apps & Charts: `main.ts`

{{%expand "🤓 At this point, if you open main.ts you will see something like this:" %}}
```ts
import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';

export class MyChart extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // define resources here

  }
}

const app = new App();
new MyChart(app, 'podinfo');
app.synth();
```
{{% /expand%}}

Apps are structured as a tree of **constructs**, which are composable units of
abstraction. We will learn more about constructs soon.

This initial code created by `cdk8s init` defines an app with a single, empty,
chart.

When you run `npm run synth`, a Kubernetes manifest YAML will be synthesized for
each `Chart` in your app and will write it to the `dist` directory.

You can try:

```shell
npm run synth
cat dist/podinfo.k8s.yaml
```

## Importing Constructs for the Kubernetes API

OK, now let's define some Kubernetes API objects inside our chart.

Similarly to **charts** and **apps**, Kubernetes API Objects are also
represented in cdk8s as **constructs**. These constructs are "imported" to your
project using the command `cdk8s import` and can then found under the
`imports/k8s.ts` file in your project directory.

When `cdk8s init` created your project it already executed `cdk8s import` for
you, so you should see an `imports/` directory already there. You can either
commit this directory to source-control or generate it as part of your build
process.

Now, let's use these constructs to define a simple Kubernetes application that
contains
[Service](https://kubernetes.io/docs/concepts/services-networking/service) and a
[Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment)
resources inspired by [hello-kubernetes](https://github.com/paulbouwer/hello-kubernetes) project.

> 🤓 At this point, if you open `main.ts` you will see something like this:

{{<highlight typescript "hl_lines=4-5 12-42">}}
import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';

/** imported constructs */
import { Deployment, Service, IntOrString } from './imports/k8s';

class MyChart extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // define resources here
    const label = { app: 'podinfo-k8s' };

    /** Deploys hello-kubernetes as a Service behind a LoadBalancer */
    new Service(this, 'service', {
      spec: {
        type: 'LoadBalancer',
        ports: [ { port: 80, targetPort: IntOrString.fromNumber(8080) } ],
        selector: label
      }
    });

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 2,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'podinfo-kubernetes',
                image: 'paulbouwer/hello-kubernetes:1.8',
                ports: [ { containerPort: 8080 } ]
              }
            ]
          }
        }
      }
    });
  }
}

const app = new App();
new MyChart(app, 'podinfo');
app.synth();
{{</highlight>}}

Now, after we execute `npm run synth`, this will be contents of
`podinfo.k8s.yaml`

{{%expand "🤓 podinfo.k8s.yaml" %}}

```yaml
apiVersion: v1
kind: Service
metadata:
  name: podinfo-service-7f4072dd
spec:
  ports:
    - port: 80
      targetPort: 8080
  selector:
    app: podinfo-k8s
  type: LoadBalancer
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: podinfo-deployment-a2a0881d
spec:
  replicas: 2
  selector:
    matchLabels:
      app: podinfo-k8s
  template:
    metadata:
      labels:
        app: podinfo-k8s
    spec:
      containers:
        - image: paulbouwer/hello-kubernetes:1.8
          name: podinfo-kubernetes
          ports:
            - containerPort: 8080
```
{{% /expand%}}

The manifest synthesized by your app is ready to be applied to any Kubernetes
cluster using standard tools like `kubectl apply`:

```console
kubectl apply -f dist/podinfo.k8s.yaml
```

> `curl a1312b596e12c411885d4c349a5b508b-923793524.ap-southeast-2.elb.amazonaws.com`

## 🤓 Basic implementation of a Redis construct for CDK8s"

{{<highlight typescript "hl_lines=6 45-48">}}
import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';

/** imported constructs */
import { Deployment, Service, IntOrString } from './imports/k8s';
import { Redis } from 'cdk8s-redis';

export class MyChart extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // define resources here
    const label = { app: 'podinfo-k8s' };

    /** Deploys hello-kubernetes as a Service behind a LoadBalancer */
    new Service(this, 'service', {
      spec: {
        type: 'LoadBalancer',
        ports: [ { port: 80, targetPort: IntOrString.fromNumber(8080) } ],
        selector: label
      }
    });

    new Deployment(this, 'deployment', {
      spec: {
        replicas: 3,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'podinfo-kubernetes',
                image: 'paulbouwer/hello-kubernetes:1.8',
                ports: [ { containerPort: 8080 } ]
              }
            ]
          }
        }
      }
    });
    
    /** Redis construct for cdk8s */
    new Redis(this, 'my-redis', {
      slaveReplicas: 4
    });

  }
}

const app = new App();
new MyChart(app, 'podinfo');
app.synth();
{{</highlight>}}