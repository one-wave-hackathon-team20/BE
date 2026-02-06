package com.onewave.server.domain.analysis.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Gemini API에서 반환하는 SWOT 분석 결과를 매핑하는 DTO입니다.
 * Gemini는 루트 선택/유사도 계산을 하지 않고, SWOT 분석만 담당합니다.
 * (루트 매칭 및 유사도는 서버의 SimilarityCalculator가 수행)
 */
@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class GeminiAnalysisResult {

    /**
     * AI가 판단한 매칭 이유
     */
    private String reason;

    /**
     * 사용자 강점
     */
    private List<String> strengths;

    /**
     * 사용자 약점
     */
    private List<String> weaknesses;

    /**
     * 로드맵 제언
     */
    private List<String> recommendations;
}
