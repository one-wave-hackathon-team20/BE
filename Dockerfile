# 1. 베이스 이미지: Java 17 실행 환경
FROM openjdk:17-jdk-slim

# 2. JAR 파일 위치 정의: 위 gradle 설정으로 생성된 app.jar를 지정
ARG JAR_FILE=build/libs/app.jar

# 3. 파일 복사: 호스트의 app.jar를 컨테이너 내부로 복사
COPY ${JAR_FILE} app.jar

# 4. 실행 명령:
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "/app.jar"]