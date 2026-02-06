package com.onewave.server.domain.analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Analysis API 응답 DTO
 * POST /api/v1/analysis, GET /api/v1/analysis/latest 공통 사용
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {

    private Long analysisId;
    private Long matchedRouteId;
    private Integer similarity;
    private String reason;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> recommendations;
    private LocalDateTime analyzedAt;
}
