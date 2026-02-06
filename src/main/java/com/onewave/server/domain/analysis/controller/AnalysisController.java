package com.onewave.server.domain.analysis.controller;

import com.onewave.server.domain.analysis.dto.AnalysisHistoryResponse;
import com.onewave.server.domain.analysis.dto.AnalysisResponse;
import com.onewave.server.domain.analysis.service.AnalysisService;
import com.onewave.server.global.response.ApiResponse;
import com.onewave.server.global.response.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
     * 6-1. AI 유사 합격자 분석 요청
     * POST /api/v1/analysis
     */
    @Operation(summary = "AI 유사 합격자 분석 요청",
            description = "사용자 정보 기반으로 Gemini API를 활용한 유사 합격 루트 분석. Request Body 없음 (서버에서 사용자 정보 자동 조회)")
    @PostMapping
    public ResponseEntity<ApiResponse<AnalysisResponse>> requestAnalysis() {
        // TODO: 인증 구현 후 @AuthenticationPrincipal 등으로 userId 추출
        AnalysisResponse response = analysisService.analyzeRoute(TEMP_USER_ID);
        return ResponseEntity.ok(ApiResponse.success("AI 분석이 완료되었습니다.", response));
    }

    /**
     * 6-2. 최근 분석 결과 조회
     * GET /api/v1/analysis/latest
     */
    @Operation(summary = "최근 분석 결과 조회",
            description = "가장 최근 AI 분석 결과 조회 (캐시된 결과)")
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<AnalysisResponse>> getLatestAnalysis() {
        // TODO: 인증 구현 후 @AuthenticationPrincipal 등으로 userId 추출
        AnalysisResponse response = analysisService.getLatestAnalysis(TEMP_USER_ID);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 6-3. 분석 이력 목록 조회
     * GET /api/v1/analysis?page=0&size=5
     */
    @Operation(summary = "분석 이력 목록 조회",
            description = "과거 AI 분석 결과 목록 조회 (정보 수정 후 재분석 비교용)")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<AnalysisHistoryResponse>>> getAnalysisHistory(
            @Parameter(description = "페이지 번호 (기본값: 0)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "페이지 크기 (기본값: 5)")
            @RequestParam(defaultValue = "5") int size) {
        // TODO: 인증 구현 후 @AuthenticationPrincipal 등으로 userId 추출
        PageResponse<AnalysisHistoryResponse> response = analysisService.getAnalysisHistory(TEMP_USER_ID, page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
