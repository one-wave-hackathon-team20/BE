package com.onewave.server.domain.analysis.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Gemini API에서 반환하는 분석 결과를 매핑하는 DTO입니다.
 * JSON 응답을 이 객체로 파싱합니다.
 */
@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GeminiAnalysisResult {

    private List<MatchedRoute> matchedRoutes;
    private AiInsight aiInsight;

    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MatchedRoute {
        private Long routeId;
        private Double similarity;
        private String summary;
        private String job;
        private String finalCompanySize;
    }

    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class AiInsight {
        private String reason;
        private List<String> strengths;
        private List<String> weaknesses;
        private List<String> recommendations;
    }
}
