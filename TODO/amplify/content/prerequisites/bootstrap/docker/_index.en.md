---
title: "Docker 101 🚀"
chapter: false
weight: 40
# pre: "<b>3.4. </b>"
---

> Fundamentals of Docker and how to use it locally within one machine 🌥🚀

### 1. Docker Version1

```
docker version

docker pull nginx:latest

docker images

docker run -d -p 8080:80 --name nginx nginx:latest

docker ps
```

1. Type `docker version` to confirm that both the client and server are there and working.
1. Type `docker pull nginx:latest` to pull down the latest nginx trusted image from Docker Hub.
1. Type `docker images` to verify that the image is now on your local machine's Docker cache. If we start it then it won't have to pull it down from Docker Hub first.
1. Type `docker run –d –p 8080:80 --name nginx nginx:latest` to instantiate the nginx image as a background daemon with port 8080 on the host forwarding through to port 80 within the container
1. Type `docker ps` to see that our nginx container is running.

> `curl http://localhost:8080` to use the nginx container and verify it is working with its default `index.html`.

```
docker logs nginx
docker exec -it nginx /bin/bash

cd /usr/share/nginx/html
cat index.html
```

1. Type `docker logs nginx` to see the logs produced by nginx and the container from our loading a page from it.
1. Type `docker exec -it nginx /bin/bash` for an interactive shell into the container's filesystem and constraints
1. Type `cd /usr/share/nginx/html` and `cat index.html` to see the content the nginx is serving which is part of the container.
1. Type `exit` to exit our shell within the container.

```
docker stop nginx
docker ps -a

docker rm nginx
docker rmi nginx:latest
```

1. Type `docker stop nginx` to stop the container.
1. Type `docker ps -a` to see that our container is still there but stopped. At this point it could be restarted with a `docker start nginx` if we wanted.
1. Type `docker rm nginx` to remove the container from our machine
1. Type `docker rmi nginx:latest` to remove the nginx image from our machine's local cache

### 2. Docker Version2

```
git clone https://github.com/nnthanh101/eks-workshop.git
cd eks-workshop/docker

cat Dockerfile

docker build -t nginx:1.0 .
docker history nginx:1.0
docker run -p 8080:80 --name nginx nginx:1.0
```

> `curl http://localhost:8080`

1. Pull down this repo onto your instance with `git clone https://github.com/nnthanh101/eks-workshop.git`
1. Type `cd eks-workshop/docker` to change into that project.
1. Type `cat Dockerfile` to see our simple `Dockerfile` - this is just adding the local `index.html` to the container image overwriting the default.
1. Type `docker build -t nginx:1.0 .` to build nginx from our Dockerfile
1. Type `docker history nginx:1.0`. to see all the steps and base containers that our nginx:1.0 is built on. Note that our change amounts to one new tiny layer on top.
1. Type `docker run -p 8080:80 --name nginx nginx:1.0` to run our new container. Note that we didn't specify the `-d` to make it a daemon which means it holds control of our terminal and outputs the containers logs to there which can be handy in debugging.
1. Open another Terminal tab (Window -> New Terminal)
1. Type `curl http://localhost:8080` in the other tab a few times and see our new content.
1. Go back to the first tab and see the log lines sent right out to STDOUT.
1. At this point we could push it to Docker Hub or a private Registry like AWS' ECR for others to pull and run. We won't worry about that yet though.
1. Type Ctrl-C to exit the log output. Note that the container has been stopped but is still there by running a `docker ps -a`.

```
docker ps -a
sudo docker inspect nginx
docker rm nginx

docker run -d -p 8080:80 -v /home/ec2-user/environment/eks-workshop/docker/index.html:/usr/share/nginx/html/index.html:ro --name nginx nginx:latest

docker stop nginx && docker start nginx
```

1. Type `sudo docker inspect nginx` to see lots of info about our stopped container.
1. Type `docker rm nginx` to delete our container.
1. Finally we'll try mouting some files from the host into the container rather than embedding them in the image. Run `docker run -d -p 8080:80 -v /home/ec2-user/environment/eks-workshop/docker/index.html:/usr/share/nginx/html/index.html:ro --name nginx nginx:latest`
1. Do a `curl http://localhost:8080`. Note that even though this is the upstream nginx image from Docker Hub our content is there.
1. Edit the index.html file and add some more things.
1. Do another `curl http://localhost:8080` and note the immediate changes.
1. Run `docker stop nginx` and `docker rm nginx` to stop and remove our last container.
