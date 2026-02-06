package com.onewave.server.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${swagger.server-url:}")
    private String serverUrl;

    @Bean
    public OpenAPI customOpenAPI() {
        OpenAPI openAPI = new OpenAPI()
                .info(new Info()
                        .title("OneWave API")
                        .version("v1.0.0")
                        .description("취업난 합격자 루트 맵 API"));

        // Add server URL if specified (for production)
        if (!serverUrl.isEmpty()) {
            openAPI.servers(List.of(
                    new Server()
                            .url(serverUrl)
                            .description("Production Server")
            ));
        }

        return openAPI;
    }
}