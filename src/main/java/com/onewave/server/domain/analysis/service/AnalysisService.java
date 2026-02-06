package com.onewave.server.domain.analysis.service;

import com.onewave.server.domain.analysis.dto.AnalysisHistoryResponse;
import com.onewave.server.domain.analysis.dto.AnalysisResponse;
import com.onewave.server.domain.analysis.dto.AnalysisResponse.AiInsightResponse;
import com.onewave.server.domain.analysis.dto.AnalysisResponse.MatchedRouteResponse;
import com.onewave.server.domain.analysis.dto.GeminiAnalysisResult;
import com.onewave.server.domain.analysis.entity.AnalysisMatchedRoute;
import com.onewave.server.domain.analysis.entity.AnalysisResult;
import com.onewave.server.domain.analysis.repository.AnalysisResultRepository;
import com.onewave.server.global.exception.BaseException;
import com.onewave.server.global.exception.ErrorCode;
import com.onewave.server.global.response.PageResponse;
import com.onewave.server.infra.gemini.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalysisService {

    private final GeminiService geminiService;
    private final AnalysisResultRepository analysisResultRepository;

    /**
     * 6-1. AI 유사 합격자 분석 요청
     * 사용자 정보를 기반으로 Gemini API를 호출하여 분석 후 결과를 저장합니다.
     */
    @Transactional
    public AnalysisResponse analyzeRoute(UUID userId) {
        // TODO: User 도메인 구현 후 실제 사용자 정보 조회로 변경
        // User user = userRepository.findById(userId)
        //     .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));
        // if (!user.isOnboardingCompleted()) {
        //     throw new BaseException(ErrorCode.ANALYSIS_INSUFFICIENT_INFO);
        // }

        // 임시 사용자 정보 (테스트용)
        String job = "FRONTEND";
        String background = "NON_MAJOR";
        List<String> companySizes = List.of("STARTUP", "SME");
        List<String> skills = List.of("react", "nextjs", "typescript");
        int projects = 2;
        boolean intern = false;
        boolean bootcamp = true;
        boolean awards = false;

        // 1. 프롬프트 생성 및 Gemini API 호출
        String prompt = buildAnalysisPrompt(job, background, companySizes, skills, projects, intern, bootcamp, awards);
        GeminiAnalysisResult geminiResult = geminiService.generateContentAs(prompt, GeminiAnalysisResult.class);

        // 2. 엔티티 생성 및 저장
        AnalysisResult analysisResult = AnalysisResult.builder()
                .userId(userId)
                .insightReason(geminiResult.getAiInsight().getReason())
                .insightStrengths(AnalysisResult.joinFromList(geminiResult.getAiInsight().getStrengths()))
                .insightWeaknesses(AnalysisResult.joinFromList(geminiResult.getAiInsight().getWeaknesses()))
                .insightRecommendations(AnalysisResult.joinFromList(geminiResult.getAiInsight().getRecommendations()))
                .build();

        AtomicInteger rankCounter = new AtomicInteger(1);
        geminiResult.getMatchedRoutes().forEach(route -> {
            AnalysisMatchedRoute matchedRoute = AnalysisMatchedRoute.builder()
                    .routeId(route.getRouteId())
                    .similarity(route.getSimilarity())
                    .summary(route.getSummary())
                    .job(route.getJob())
                    .finalCompanySize(route.getFinalCompanySize())
                    .rank(rankCounter.getAndIncrement())
                    .build();
            analysisResult.addMatchedRoute(matchedRoute);
        });

        analysisResultRepository.save(analysisResult);
        log.info("AI 분석 결과 저장 완료. analysisId={}, userId={}", analysisResult.getId(), userId);

        // 3. 응답 변환
        return toAnalysisResponse(analysisResult);
    }

    /**
     * 6-2. 최근 분석 결과 조회
     */
    public AnalysisResponse getLatestAnalysis(UUID userId) {
        AnalysisResult result = analysisResultRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new BaseException(ErrorCode.ANALYSIS_NOT_FOUND));

        return toAnalysisResponse(result);
    }

    /**
     * 6-3. 분석 이력 목록 조회
     */
    public PageResponse<AnalysisHistoryResponse> getAnalysisHistory(UUID userId, int page, int size) {
        Page<AnalysisResult> resultPage = analysisResultRepository
                .findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(page, size));

        return PageResponse.from(resultPage, this::toHistoryResponse);
    }

    // ── 프롬프트 생성 ──────────────────────────────────────────

    private String buildAnalysisPrompt(String job, String background, List<String> companySizes,
                                        List<String> skills, int projects, boolean intern,
                                        boolean bootcamp, boolean awards) {
        return String.format("""
                당신은 취업 분석 AI 전문가입니다. 아래 사용자의 프로필을 분석하고 유사한 합격자 루트를 추천해주세요.
                
                ## 사용자 프로필
                - 희망 직무: %s
                - 전공 여부: %s
                - 희망 기업 규모: %s
                - 기술 스택: %s
                - 프로젝트 경험: %d개
                - 인턴 경험: %s
                - 부트캠프 경험: %s
                - 수상 경력: %s
                
                ## 요청 사항
                위 사용자 프로필을 기반으로 유사한 합격 루트 3개를 추천하고, AI 인사이트를 제공해주세요.
                
                ## 응답 형식 (반드시 아래 JSON 형식으로만 응답)
                {
                  "matchedRoutes": [
                    {
                      "routeId": 1,
                      "similarity": 87.5,
                      "summary": "합격 루트 요약 (화살표로 연결, 예: 비전공 → 독학 6개월 → 포트폴리오 2개 → 중소기업 합격)",
                      "job": "FRONTEND",
                      "finalCompanySize": "MIDSIZE"
                    },
                    {
                      "routeId": 2,
                      "similarity": 72.3,
                      "summary": "두 번째 루트 요약",
                      "job": "FRONTEND",
                      "finalCompanySize": "STARTUP"
                    },
                    {
                      "routeId": 3,
                      "similarity": 65.1,
                      "summary": "세 번째 루트 요약",
                      "job": "FRONTEND",
                      "finalCompanySize": "SME"
                    }
                  ],
                  "aiInsight": {
                    "reason": "이 사용자와 추천 루트가 유사한 이유를 2~3문장으로 상세히 설명",
                    "strengths": ["강점 1", "강점 2"],
                    "weaknesses": ["약점 1", "약점 2"],
                    "recommendations": ["구체적 추천 사항 1", "구체적 추천 사항 2", "구체적 추천 사항 3"]
                  }
                }
                
                중요:
                - 반드시 matchedRoutes 3개를 포함하세요.
                - similarity는 0~100 사이 소수점 1자리 숫자입니다.
                - finalCompanySize는 STARTUP, SME, MIDSIZE, ENTERPRISE 중 하나입니다.
                - JSON 형식으로만 응답하세요. 추가 설명이나 마크다운 포맷은 사용하지 마세요.
                """,
                job,
                background,
                String.join(", ", companySizes),
                String.join(", ", skills),
                projects,
                intern ? "있음" : "없음",
                bootcamp ? "있음" : "없음",
                awards ? "있음" : "없음"
        );
    }

    // ── 엔티티 → DTO 변환 ──────────────────────────────────────

    private AnalysisResponse toAnalysisResponse(AnalysisResult entity) {
        List<MatchedRouteResponse> matchedRoutes = entity.getMatchedRoutes().stream()
                .map(route -> MatchedRouteResponse.builder()
                        .routeId(route.getRouteId())
                        .similarity(route.getSimilarity())
                        .summary(route.getSummary())
                        .job(route.getJob())
                        .finalCompanySize(route.getFinalCompanySize())
                        .build())
                .toList();

        AiInsightResponse aiInsight = AiInsightResponse.builder()
                .reason(entity.getInsightReason())
                .strengths(entity.getStrengthsList())
                .weaknesses(entity.getWeaknessesList())
                .recommendations(entity.getRecommendationsList())
                .build();

        return AnalysisResponse.builder()
                .analysisId(entity.getId())
                .matchedRoutes(matchedRoutes)
                .aiInsight(aiInsight)
                .analyzedAt(entity.getCreatedAt())
                .build();
    }

    private AnalysisHistoryResponse toHistoryResponse(AnalysisResult entity) {
        // 매칭 루트 중 1순위 정보 추출
        String topMatchSummary = null;
        Double topSimilarity = null;

        if (!entity.getMatchedRoutes().isEmpty()) {
            AnalysisMatchedRoute topRoute = entity.getMatchedRoutes().get(0);
            topMatchSummary = topRoute.getSummary();
            topSimilarity = topRoute.getSimilarity();
        }

        return AnalysisHistoryResponse.builder()
                .analysisId(entity.getId())
                .topMatchSummary(topMatchSummary)
                .topSimilarity(topSimilarity)
                .analyzedAt(entity.getCreatedAt())
                .build();
    }
}
