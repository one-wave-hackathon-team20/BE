package com.onewave.server.domain.analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisHistoryResponse {

    private String analysisId;
    private String topMatchSummary;
    private Double topSimilarity;
    private LocalDateTime analyzedAt;
}
