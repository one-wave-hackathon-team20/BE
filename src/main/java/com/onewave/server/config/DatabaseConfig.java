package com.onewave.server.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DatabaseConfig {

    /**
     * 데이터베이스 연결이 실패해도 애플리케이션이 시작되도록 설정
     * 실제 사용 시에는 데이터베이스 연결이 필요합니다.
     */
    @Bean
    @Primary
    @ConditionalOnProperty(name = "spring.datasource.url")
    @ConfigurationProperties("spring.datasource.hikari")
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
}
