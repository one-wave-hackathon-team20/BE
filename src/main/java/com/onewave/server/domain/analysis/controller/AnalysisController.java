package com.onewave.server.domain.analysis.controller;

import com.onewave.server.domain.analysis.dto.AnalysisResponse;
import com.onewave.server.domain.analysis.service.AnalysisService;
import com.onewave.server.global.response.ApiResponse;
import com.onewave.server.global.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analysis")
@RequiredArgsConstructor
public class AnalysisController {

    private final AnalysisService analysisService;

    @PostMapping
    public ApiResponse<AnalysisResponse> analyze(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        AnalysisResponse response = analysisService.analyze(userPrincipal.getUserId());
        return ApiResponse.success("분석이 완료되었습니다.", response);
    }

    @GetMapping("/latest")
    public ApiResponse<AnalysisResponse> getLatestAnalysis(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        AnalysisResponse response = analysisService.getLatestAnalysis(userPrincipal.getUserId());
        return ApiResponse.success(response);
    }
}
