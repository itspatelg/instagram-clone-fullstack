# Step 1: Build using lightweight Ubuntu image
FROM ubuntu:22.04 AS build
RUN apt-get update &
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests
# Step 2: Pure Ubuntu base for running the app
FROM ubuntu:22.04
RUN apt-get update &
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
