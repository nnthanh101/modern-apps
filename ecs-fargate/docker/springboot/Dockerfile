##############################
## Build stage
##############################
FROM maven:3.6-jdk-11-slim AS build
COPY src     /home/app/src
COPY pom.xml /home/app
# COPY scripts /home/app
RUN mvn -f   /home/app/pom.xml clean package

##############################
## Package stage
##############################
FROM openjdk:11-jre-slim
COPY --from=build /home/app/target/starter-0.0.1-SNAPSHOT.jar /app.jar
# VOLUME /tmp
# ARG JAR_FILE
# ADD ./target/${JAR_FILE} app.jar
RUN sh -c 'touch /app.jar'
ENV JAVA_OPTS=""
EXPOSE 80
ENV ACTIVE_PROFILE=dev
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar --spring.datasource.initialization-mode=always" ]
# ENTRYPOINT ["java","-jar","/usr/local/lib/app.jar"]