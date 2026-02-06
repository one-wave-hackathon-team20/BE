package com.onewave.server.domain.analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {

    private String analysisId;
    private List<MatchedRouteResponse> matchedRoutes;
    private AiInsightResponse aiInsight;
    private LocalDateTime analyzedAt;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatchedRouteResponse {
        private Long routeId;
        private Double similarity;
        private String summary;
        private String job;
        private String finalCompanySize;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AiInsightResponse {
        private String reason;
        private List<String> strengths;
        private List<String> weaknesses;
        private List<String> recommendations;
    }
}
