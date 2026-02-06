package com.onewave.server.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * 
 * This configuration allows the backend to accept requests from specified frontend origins.
 * In production, specify exact frontend domains instead of using "*" for security.
 */
@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:*}")
    private String[] allowedOrigins;

    @Value("${cors.allowed-methods:GET,POST,PUT,PATCH,DELETE,OPTIONS}")
    private String[] allowedMethods;

    @Value("${cors.allowed-headers:*}")
    private String[] allowedHeaders;

    @Value("${cors.exposed-headers:Authorization}")
    private String[] exposedHeaders;

    @Value("${cors.allow-credentials:false}")
    private boolean allowCredentials;

    @Value("${cors.max-age:3600}")
    private long maxAge;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allowed origins - specify frontend URLs in production
        // Example: http://localhost:3000, https://yourdomain.com
        if (allowedOrigins.length == 1 && "*".equals(allowedOrigins[0])) {
            configuration.addAllowedOriginPattern("*"); // Allow all origins (development only)
        } else {
            // Use addAllowedOriginPattern instead of setAllowedOrigins for better compatibility
            Arrays.stream(allowedOrigins).forEach(configuration::addAllowedOriginPattern);
        }
        
        // Allowed HTTP methods
        configuration.setAllowedMethods(Arrays.asList(allowedMethods));
        
        // Allowed headers - headers that frontend can send
        configuration.setAllowedHeaders(Arrays.asList(allowedHeaders));
        
        // Exposed headers - headers that frontend can read from response
        configuration.setExposedHeaders(Arrays.asList(exposedHeaders));
        
        // Allow credentials (cookies, authorization headers)
        // Note: When allowCredentials is true, allowedOrigins cannot be "*"
        configuration.setAllowCredentials(allowCredentials);
        
        // Cache preflight request results for specified seconds
        configuration.setMaxAge(maxAge);

        // Apply CORS configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
