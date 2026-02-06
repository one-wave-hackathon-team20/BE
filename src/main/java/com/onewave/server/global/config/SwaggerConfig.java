package com.onewave.server.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean

    public OpenAPI dongajulOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Dongajul API")
                        .version("v1.0.0"));

    }
}