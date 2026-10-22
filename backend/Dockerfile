FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests package

FROM eclipse-temurin:21-jre
RUN useradd --system --no-create-home sentinelx
USER sentinelx
WORKDIR /app
COPY --from=build /app/target/sentinelx-backend.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
