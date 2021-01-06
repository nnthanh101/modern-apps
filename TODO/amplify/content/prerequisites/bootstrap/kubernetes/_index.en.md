---
title: "Kubernetes 101 🚀"
chapter: false
weight: 50
# pre: "<b>3.5. </b>"
---

{{% notice tip %}}
aws eks update-kubeconfig --name 'EKS-Cluster'
{{% /notice %}}

Focus on how to deploy and machine our containers on a pool of machines managed by Kubernetes.

Ensure you have completed the [setup Kubernetes](https://eks.aws.job4u.io/en/prerequisites/bootstrap) first.

```
kubectl version

kubectl create deployment nginx --image=nginx

kubectl describe deployments

kubectl describe pods

kubectl describe replicasets
```

1. Type `kubectl version` to confirm that both the client and server are there and working.
1. Type `kubectl create deployment nginx --image=nginx` to create a single-Pod deployment of nginx.
1. Type `kubectl describe deployments` to see the details of our new deployment.
1. Type `kubectl describe pods` to see the pod that our deployment has created for us. Note that there is no port exposed for this contianer.
1. Type `kubectl describe replicasets` to see there is a replicaset too.
    1. A `Deployment` creates/manages `ReplicaSet(s)` which, in turn, creates the required `Pod(s)`.
1. Type `kubectl scale --replicas=3 deployment/nginx` to launch two more nginx Pods taking us to three.

```
kubectl scale --replicas=3 deployment/nginx

kubectl get deployments

kubectl get pods -o wide

kubectl run my-shell --rm -i --tty --image ubuntu -- bash
```

1. Type `kubectl get deployments` and `kubectl get pods -o wide` to see our change has taken effect (that there are three pods running). Also note the Pod IPs (copy/paste them to notepad or something).
1. Type `kubectl run my-shell --rm -i --tty --image ubuntu -- bash` to connect interactively into `bash` on a new ubuntu pod.
1. Type `apt update; apt install curl -y` then `curl http://<an IP from describe pods>` and watch it load the default nginx page on our nginx pod.
    1. By default all pods in the cluster can reach all other pods in the cluster directly by IP. You can restrict this with `NetworkPolicies` which is Kubernetes' firewall.
1. Type `exit` and, because we did a --rm in the command above, it'll delete the deployment and pod once we disconnect from our interactive session.

```
kubectl expose deployment nginx --port=80 --target-port=80 --name nginx --type=LoadBalancer

kubectl get services
kubectl logs -lapp=nginx

kubectl get service/nginx deployment/nginx --export=true -o yaml > nginx.yml
```

1. Type `kubectl expose deployment nginx --port=80 --target-port=80 --name nginx --type=LoadBalancer` to create a service backed by an AWS Elastic Load Balancer that not only balances the load between all the Pods but exposes it to the Internet.
    1. It will take a minute to create the ELB. You can watch the progress of it being created in the AWS EC2 Console under `Load Balancers` on the left-hand side.
1. Type `kubectl get services` and copy the `EXTERNAL-IP` address. Open a web browser tab and go to `http://<that address>` and see it load. Note that it will take a minute or so for the ELB to be provisioned before this will work. Refresh this a few times to generate some access logs.
1. Type `kubectl logs -lapp=nginx` to get the aggregated logs of all the nginx Pods to see the details of our recent requests.
1. Type `kubectl get service/nginx deployment/nginx --export=true -o yaml > nginx.yml` to back up our work.
    1. Edit the file and have a look (double-click on it in Cloud9 in the pane on the left to open it in that IDE or use nano/vim in the Terminal). We could have written our requirements for what we need Kubernetes to do into YAML files like this in the first place instead of using these kubectl commands - and often you would do that and put it in a CI/CD pipeline etc. Note that you can put the definitions for multiple types of resources (in this example both a service and a deployment) in one YAML file.

```
kubectl delete service/nginx deployment/nginx

kubectl apply -f nginx.yml
```

1. Type `kubectl delete service/nginx deployment/nginx` to clean up what we've done.
1. Type `kubectl apply -f nginx.yml` to put it back again. See how easy it is to export and reapply the YAML?
1. In the Docker example we mounted a volume outside the container. You can do the same thing in Kubernetes at scale with a PersistentVolume (using an EBS volume in AWS) and a StatefulSet. Go through the example at https://eksworkshop.com/statefulset/ to see how you can run a stateful application like MySQL on the cluster.