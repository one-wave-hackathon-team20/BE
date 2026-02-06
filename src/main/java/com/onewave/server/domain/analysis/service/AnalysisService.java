package com.onewave.server.domain.analysis.service;

import com.onewave.server.domain.analysis.dto.*;
import com.onewave.server.domain.analysis.entity.AnalysisHistory;
import com.onewave.server.domain.analysis.repository.AnalysisHistoryRepository;
import com.onewave.server.global.exception.BaseException;
import com.onewave.server.global.exception.ErrorCode;
import com.onewave.server.infra.gemini.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalysisService {

    private final GeminiService geminiService;
    private final SimilarityCalculator similarityCalculator;
    private final AnalysisHistoryRepository analysisHistoryRepository;

    /**
     * POST /api/v1/analysis
     *
     * 처리 흐름:
     * 1. 캐싱 확인 → 기존 결과 있으면 즉시 반환
     * 2. 사용자 스펙(user_details) 조회
     * 3. 전체 합격 사례(routes) 조회
     * 4. SimilarityCalculator로 코사인 유사도 계산 → 최적 route 매칭
     * 5. 매칭된 route + 사용자 프로필을 Gemini에 전달 → SWOT 분석 수신
     * 6. 결과를 analysis_history에 저장 후 반환
     */
    @Transactional
    public AnalysisResponse analyzeRoute(UUID userId) {
        // TODO: User 도메인 구현 후 실제 사용자 정보 조회로 변경
        // User user = userRepository.findById(userId)
        //     .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));
        // if (!user.isOnboardingCompleted()) {
        //     throw new BaseException(ErrorCode.ANALYSIS_INSUFFICIENT_INFO);
        // }

        // ── 캐싱: 기존 분석 결과가 있으면 Gemini 호출 없이 반환 ──
        Optional<AnalysisHistory> cached = analysisHistoryRepository
                .findTopByUserIdOrderByCreatedAtDesc(userId);
        if (cached.isPresent()) {
            log.info("캐시된 분석 결과 반환. userId={}, analysisId={}", userId, cached.get().getId());
            return toResponse(cached.get());
        }

        // ── 1. 데이터 준비 ──
        UserProfileData userProfile = getTempUserProfile();
        List<RouteData> routes = getTempRoutes();

        // ── 2. 유사도 계산 및 최적 루트 매칭 ──
        SimilarityCalculator.MatchResult matchResult = similarityCalculator
                .findBestMatch(userProfile, routes)
                .orElseThrow(() -> new BaseException(ErrorCode.ANALYSIS_INSUFFICIENT_INFO));

        RouteData matchedRoute = routes.stream()
                .filter(r -> r.getId().equals(matchResult.routeId()))
                .findFirst()
                .orElseThrow(() -> new BaseException(ErrorCode.GEMINI_API_ERROR));

        log.info("유사도 계산 완료. matchedRouteId={}, similarity={}", matchResult.routeId(), matchResult.similarity());

        // ── 3. Gemini API 호출 (SWOT 분석만) ──
        GeminiAnalysisResult geminiResult = callGeminiForSwot(userProfile, matchedRoute, matchResult.similarity());

        // ── 4. 엔티티 생성 및 저장 ──
        AnalysisHistory history = saveAnalysisHistory(userId, matchResult, geminiResult);

        return toResponse(history);
    }

    /**
     * GET /api/v1/analysis/latest
     * 가장 최근에 수행된 분석 결과 조회 (캐시된 결과 즉시 반환)
     */
    public AnalysisResponse getLatestAnalysis(UUID userId) {
        AnalysisHistory history = analysisHistoryRepository
                .findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new BaseException(ErrorCode.ANALYSIS_NOT_FOUND));

        return toResponse(history);
    }

    /**
     * 사용자 스펙 수정 시 기존 분석 결과 무효화
     * TODO: User 도메인의 PATCH /api/v1/users/me 에서 호출
     */
    @Transactional
    public void invalidateAnalysis(UUID userId) {
        analysisHistoryRepository.deleteAllByUserId(userId);
        log.info("분석 결과 무효화 완료. userId={}", userId);
    }

    // ── Gemini 호출 ──────────────────────────────────────────────

    private GeminiAnalysisResult callGeminiForSwot(UserProfileData user, RouteData matchedRoute, int similarity) {
        String prompt = buildSwotPrompt(user, matchedRoute, similarity);

        try {
            return geminiService.generateContentAs(prompt, GeminiAnalysisResult.class);
        } catch (BaseException e) {
            log.error("Gemini SWOT 분석 실패. matchedRouteId={}, similarity={}", matchedRoute.getId(), similarity);
            throw e;
        }
    }

    private AnalysisHistory saveAnalysisHistory(UUID userId, SimilarityCalculator.MatchResult matchResult,
                                                 GeminiAnalysisResult geminiResult) {
        AnalysisHistory history = AnalysisHistory.builder()
                .userId(userId)
                .matchedRouteId(matchResult.routeId())
                .similarity(matchResult.similarity())
                .reason(geminiResult.getReason())
                .strengths(AnalysisHistory.joinToCsv(geminiResult.getStrengths()))
                .weaknesses(AnalysisHistory.joinToCsv(geminiResult.getWeaknesses()))
                .recommendations(AnalysisHistory.joinToCsv(geminiResult.getRecommendations()))
                .build();

        analysisHistoryRepository.save(history);
        log.info("AI 분석 결과 저장 완료. analysisId={}, matchedRouteId={}, similarity={}, userId={}",
                history.getId(), matchResult.routeId(), matchResult.similarity(), userId);

        return history;
    }

    // ── Gemini 프롬프트 (SWOT 분석 전용) ──────────────────────────

    private String buildSwotPrompt(UserProfileData user, RouteData matchedRoute, int similarity) {
        return String.format("""
                당신은 IT 채용 데이터 분석 전문가입니다.
                아래 사용자의 스펙과, 시스템이 유사도 %d%%로 매칭한 합격자 사례를 비교하여 SWOT 분석을 수행해주세요.
                
                ## 사용자 프로필
                - 희망 직무: %s
                - 전공 여부: %s
                - 선호 기업 규모: %s
                - 기술 스택: %s
                - 프로젝트 경험: %d개
                - 인턴 경험: %s
                - 부트캠프 경험: %s
                - 수상 경력: %s
                
                ## 매칭된 합격자 사례 (Route ID: %d)
                - 합격 직무: %s
                - 전공 여부: %s
                - 최종 합격 기업: %s
                - 기술 스택: %s
                - 프로젝트 수: %d개
                - 인턴 경험: %s
                - 부트캠프: %s
                - 수상 경력: %s
                - 합격 과정 요약: %s
                
                ## 요청 사항
                1. 이 합격자 사례가 사용자와 왜 유사한지 매칭 이유를 설명하세요.
                2. 사용자의 강점을 분석하세요 (이 합격자와 비교하여).
                3. 사용자의 약점/보완점을 분석하세요.
                4. 합격을 위한 구체적인 로드맵 추천 사항을 제시하세요.
                
                ## 응답 형식 (반드시 아래 JSON 형식으로만 응답)
                {
                  "reason": "이 합격 사례가 사용자와 유사한 이유를 2~3문장으로 상세히 설명",
                  "strengths": ["강점 1", "강점 2"],
                  "weaknesses": ["약점 1", "약점 2"],
                  "recommendations": ["구체적 추천 사항 1", "구체적 추천 사항 2", "구체적 추천 사항 3"]
                }
                
                중요:
                - strengths, weaknesses는 각각 2개 이상 작성하세요.
                - recommendations는 3개 이상 구체적으로 작성하세요.
                - JSON 형식으로만 응답하세요. 추가 설명이나 마크다운 포맷은 사용하지 마세요.
                """,
                similarity,
                user.getJob(), user.getBackground(), user.getCompanySizes(),
                user.getSkills(), user.getProjects(),
                Boolean.TRUE.equals(user.getIntern()) ? "있음" : "없음",
                Boolean.TRUE.equals(user.getBootcamp()) ? "있음" : "없음",
                Boolean.TRUE.equals(user.getAwards()) ? "있음" : "없음",
                matchedRoute.getId(),
                matchedRoute.getJob(), matchedRoute.getBackground(), matchedRoute.getFinalCompanySize(),
                matchedRoute.getSkills(),
                matchedRoute.getProjects() != null ? matchedRoute.getProjects() : 0,
                Boolean.TRUE.equals(matchedRoute.getIntern()) ? "있음" : "없음",
                Boolean.TRUE.equals(matchedRoute.getBootcamp()) ? "있음" : "없음",
                Boolean.TRUE.equals(matchedRoute.getAwards()) ? "있음" : "없음",
                matchedRoute.getSummary()
        );
    }

    // ── 임시 데이터 (TODO: 각 도메인 구현 후 DB 조회로 교체) ──────

    private UserProfileData getTempUserProfile() {
        return UserProfileData.builder()
                .job("FRONTEND")
                .background("NON_MAJOR")
                .companySizes("STARTUP,SME")
                .skills("react,nextjs,typescript")
                .projects(2)
                .intern(false)
                .bootcamp(true)
                .awards(false)
                .build();
    }

    private List<RouteData> getTempRoutes() {
        return List.of(
                RouteData.builder().id(1L).job("FRONTEND").background("NON_MAJOR").finalCompanySize("MIDSIZE")
                        .skills("react,javascript,css").projects(2).intern(false).bootcamp(false).awards(false)
                        .summary("비전공 → 독학 6개월 → 포트폴리오 2개 → 중소기업 합격 → 중견기업 이직").build(),
                RouteData.builder().id(2L).job("FRONTEND").background("NON_MAJOR").finalCompanySize("SME")
                        .skills("react,nextjs").projects(1).intern(false).bootcamp(true).awards(false)
                        .summary("비전공 → 부트캠프 3개월 → 팀 프로젝트 1개 → 중소기업 합격").build(),
                RouteData.builder().id(3L).job("FRONTEND").background("MAJOR").finalCompanySize("ENTERPRISE")
                        .skills("react,typescript,nextjs").projects(4).intern(true).bootcamp(false).awards(true)
                        .summary("전공 → 인턴 6개월 → 프로젝트 4개 → 대기업 합격").build(),
                RouteData.builder().id(4L).job("BACKEND").background("NON_MAJOR").finalCompanySize("STARTUP")
                        .skills("java,spring").projects(3).intern(false).bootcamp(true).awards(false)
                        .summary("비전공 → 부트캠프 → 개인 프로젝트 3개 → 스타트업 합격").build(),
                RouteData.builder().id(5L).job("FRONTEND").background("NON_MAJOR").finalCompanySize("STARTUP")
                        .skills("react,vue,typescript").projects(3).intern(false).bootcamp(true).awards(false)
                        .summary("비전공 → 부트캠프 → 팀 프로젝트 3개 → 스타트업 합격").build()
        );
    }

    // ── 엔티티 → DTO 변환 ──────────────────────────────────────

    private AnalysisResponse toResponse(AnalysisHistory entity) {
        return AnalysisResponse.builder()
                .analysisId(entity.getId())
                .matchedRouteId(entity.getMatchedRouteId())
                .similarity(entity.getSimilarity())
                .reason(entity.getReason())
                .strengths(entity.getStrengthsList())
                .weaknesses(entity.getWeaknessesList())
                .recommendations(entity.getRecommendationsList())
                .analyzedAt(entity.getCreatedAt())
                .build();
    }
}
