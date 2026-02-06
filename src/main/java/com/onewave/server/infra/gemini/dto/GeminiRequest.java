package com.onewave.server.infra.gemini.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeminiRequest {

    private List<Content> contents;
    private GenerationConfig generationConfig;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private List<Part> parts;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Part {
        private String text;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenerationConfig {
        private Double temperature;
        private Integer maxOutputTokens;
        private String responseMimeType;
    }

    /**
     * 간편하게 텍스트 프롬프트로 GeminiRequest를 생성합니다.
     */
    public static GeminiRequest of(String prompt) {
        return GeminiRequest.builder()
                .contents(List.of(
                        Content.builder()
                                .parts(List.of(
                                        Part.builder().text(prompt).build()
                                ))
                                .build()
                ))
                .generationConfig(GenerationConfig.builder()
                        .temperature(0.7)
                        .maxOutputTokens(4096)
                        .responseMimeType("application/json")
                        .build())
                .build();
    }
}
