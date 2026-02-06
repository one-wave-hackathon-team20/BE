package com.onewave.server.domain.analysis.service;

import com.onewave.server.domain.analysis.dto.AnalysisResponse;
import com.onewave.server.domain.analysis.entity.AnalysisHistory;
import com.onewave.server.domain.analysis.repository.AnalysisHistoryRepository;
import com.onewave.server.domain.analysis.service.GeminiService.AnalysisResult;
import com.onewave.server.domain.route.entity.Route;
import com.onewave.server.domain.route.service.RouteService;
import com.onewave.server.domain.user.entity.User;
import com.onewave.server.domain.user.entity.UserDetails;
import com.onewave.server.domain.user.repository.UserDetailsRepository;
import com.onewave.server.domain.user.repository.UserRepository;
import com.onewave.server.global.exception.BaseException;
import com.onewave.server.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalysisService {

    private final UserRepository userRepository;
    private final UserDetailsRepository userDetailsRepository;
    private final RouteService routeService;
    private final AnalysisHistoryRepository analysisHistoryRepository;
    private final GeminiService geminiService;

    @Transactional
    public AnalysisResponse analyze(UUID userId) {
        // 사용자 및 상세 정보 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        UserDetails userDetails = userDetailsRepository.findByUser(user)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_DETAILS_NOT_FOUND));

        // 전체 routes 조회
        List<Route> routes = routeService.getAllRoutes();

        if (routes.isEmpty()) {
            throw new BaseException(ErrorCode.ROUTE_NOT_FOUND, "분석할 합격 사례가 없습니다.");
        }

        // Gemini API 호출
        AnalysisResult result = geminiService.analyze(userDetails, routes);

        // 매칭된 Route 조회
        Route matchedRoute = routes.stream()
                .filter(route -> route.getId().equals(result.getMatchedRouteId()))
                .findFirst()
                .orElseThrow(() -> new BaseException(ErrorCode.ROUTE_NOT_FOUND));

        // AnalysisHistory 저장
        AnalysisHistory analysisHistory = AnalysisHistory.builder()
                .user(user)
                .matchedRoute(matchedRoute)
                .similarity(result.getSimilarity())
                .reason(result.getReason())
                .strengths(convertListToString(result.getStrengths()))
                .weaknesses(convertListToString(result.getWeaknesses()))
                .recommendations(convertListToString(result.getRecommendations()))
                .build();

        analysisHistory = analysisHistoryRepository.save(analysisHistory);

        return toAnalysisResponse(analysisHistory);
    }

    public AnalysisResponse getLatestAnalysis(UUID userId) {
        AnalysisHistory analysisHistory = analysisHistoryRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new BaseException(ErrorCode.ANALYSIS_NOT_FOUND));

        return toAnalysisResponse(analysisHistory);
    }

    private AnalysisResponse toAnalysisResponse(AnalysisHistory analysisHistory) {
        return AnalysisResponse.builder()
                .id(analysisHistory.getId())
                .matchedRouteId(analysisHistory.getMatchedRoute().getId())
                .similarity(analysisHistory.getSimilarity())
                .reason(analysisHistory.getReason())
                .strengths(convertStringToList(analysisHistory.getStrengths()))
                .weaknesses(convertStringToList(analysisHistory.getWeaknesses()))
                .recommendations(convertStringToList(analysisHistory.getRecommendations()))
                .createdAt(analysisHistory.getCreatedAt())
                .build();
    }

    private String convertListToString(List<String> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        return String.join(",", list);
    }

    private List<String> convertStringToList(String str) {
        if (str == null || str.isBlank()) {
            return List.of();
        }
        return Arrays.stream(str.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toList());
    }
}
