# Step 1: Build using lightweight Ubuntu image
FROM ubuntu:22.04 AS build

# Install Java 17 and Maven manually
RUN apt-get update && \
    apt-get install -y openjdk-17-jdk maven && \
    apt-get clean

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Step 2: Run using official Ubuntu openjdk runtime
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]