package com.onewave.server.domain.analysis.controller;

import com.onewave.server.domain.analysis.dto.AnalysisResponse;
import com.onewave.server.domain.analysis.service.AnalysisService;
import com.onewave.server.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@Tag(name = "Analysis", description = "AI 분석 API")
@RestController
@RequestMapping("/api/v1/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    // TODO: 인증 구현 후 제거 (임시 테스트용 userId)
    private static final UUID TEMP_USER_ID = UUID.fromString("550e8400-e29b-41d4-a716-446655440000");

    /**
     * POST /api/v1/analysis
     * 사용자 스펙 기반 유사도 계산 + Gemini SWOT 분석
     * 캐싱된 결과가 있으면 즉시 반환
     */
    @Operation(summary = "AI 유사 합격자 분석 요청",
            description = "사용자 스펙 기반 코사인 유사도 계산 → 최적 루트 매칭 → Gemini SWOT 분석. "
                    + "캐싱된 결과가 있으면 Gemini 호출 없이 즉시 반환. Request Body 없음 (서버에서 자동 조회)")
    @PostMapping
    public ResponseEntity<ApiResponse<AnalysisResponse>> requestAnalysis() {
        // TODO: 인증 구현 후 @AuthenticationPrincipal 등으로 userId 추출
        AnalysisResponse response = analysisService.analyzeRoute(TEMP_USER_ID);
        return ResponseEntity.ok(ApiResponse.success("AI 분석이 완료되었습니다.", response));
    }

    /**
     * GET /api/v1/analysis/latest
     * 가장 최근에 수행된 분석 결과 조회 (캐시된 결과 즉시 반환)
     */
    @Operation(summary = "최근 분석 결과 조회",
            description = "가장 최근에 수행된 AI 분석 결과 조회 (DB 캐시, Gemini 호출 없음)")
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<AnalysisResponse>> getLatestAnalysis() {
        // TODO: 인증 구현 후 @AuthenticationPrincipal 등으로 userId 추출
        AnalysisResponse response = analysisService.getLatestAnalysis(TEMP_USER_ID);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
