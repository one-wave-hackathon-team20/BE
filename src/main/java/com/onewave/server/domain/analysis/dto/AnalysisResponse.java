package com.onewave.server.domain.analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class AnalysisResponse {
    private Long id;
    private Long matchedRouteId;
    private Integer similarity;
    private String reason;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> recommendations;
    private LocalDateTime createdAt;
}
