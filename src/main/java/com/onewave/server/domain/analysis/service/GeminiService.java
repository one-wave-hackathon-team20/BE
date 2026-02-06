package com.onewave.server.domain.analysis.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.onewave.server.domain.route.entity.Route;
import com.onewave.server.domain.user.entity.UserDetails;
import com.onewave.server.global.exception.BaseException;
import com.onewave.server.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model:gemini-pro}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    public AnalysisResult analyze(UserDetails userDetails, List<Route> routes) {
        try {
            String prompt = buildPrompt(userDetails, routes);
            String response = callGeminiAPI(prompt);
            return parseResponse(response);
        } catch (Exception e) {
            log.error("Gemini API 호출 실패", e);
            throw new BaseException(ErrorCode.GEMINI_API_ERROR);
        }
    }

    private String buildPrompt(UserDetails userDetails, List<Route> routes) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("당신은 IT 채용 데이터 분석 전문가입니다.\n\n");
        prompt.append("사용자의 스펙과 가장 닮은 합격자 데이터를 매칭하고, SWOT 분석을 통해 향후 전략을 제시해주세요.\n\n");
        
        prompt.append("=== 사용자 스펙 ===\n");
        prompt.append(String.format("직무: %s\n", userDetails.getJob()));
        prompt.append(String.format("전공 여부: %s\n", userDetails.getBackground()));
        prompt.append(String.format("보유 기술: %s\n", userDetails.getSkills() != null ? userDetails.getSkills() : "없음"));
        prompt.append(String.format("프로젝트 수: %d\n", userDetails.getProjects()));
        prompt.append(String.format("인턴 경험: %s\n", userDetails.getIntern() != null && userDetails.getIntern() ? "있음" : "없음"));
        prompt.append(String.format("부트캠프 수료: %s\n", userDetails.getBootcamp() != null && userDetails.getBootcamp() ? "있음" : "없음"));
        prompt.append(String.format("수상 경력: %s\n", userDetails.getAwards() != null && userDetails.getAwards() ? "있음" : "없음"));
        prompt.append("\n");

        prompt.append("=== 합격 사례 목록 ===\n");
        for (int i = 0; i < routes.size(); i++) {
            Route route = routes.get(i);
            prompt.append(String.format("[사례 %d] ID: %d\n", i + 1, route.getId()));
            prompt.append(String.format("  직무: %s, 전공: %s, 최종 기업 규모: %s\n", route.getJob(), route.getBackground(), route.getFinalCompanySize()));
            prompt.append(String.format("  기술: %s, 프로젝트: %d\n", route.getSkills() != null ? route.getSkills() : "없음", route.getProjects() != null ? route.getProjects() : 0));
            prompt.append(String.format("  인턴: %s, 부트캠프: %s, 수상: %s\n", 
                route.getIntern() != null && route.getIntern() ? "있음" : "없음",
                route.getBootcamp() != null && route.getBootcamp() ? "있음" : "없음",
                route.getAwards() != null && route.getAwards() ? "있음" : "없음"));
            if (route.getSummary() != null) {
                prompt.append(String.format("  요약: %s\n", route.getSummary()));
            }
            prompt.append("\n");
        }

        prompt.append("\n=== 요청사항 ===\n");
        prompt.append("다음 JSON 형식으로만 응답해주세요:\n");
        prompt.append("{\n");
        prompt.append("  \"matchedRouteId\": 매칭된 사례의 ID (숫자),\n");
        prompt.append("  \"similarity\": 유사도 점수 (0~100 정수),\n");
        prompt.append("  \"reason\": 매칭 이유 (문자열),\n");
        prompt.append("  \"strengths\": [\"강점1\", \"강점2\"],\n");
        prompt.append("  \"weaknesses\": [\"약점1\", \"약점2\"],\n");
        prompt.append("  \"recommendations\": [\"제안1\", \"제안2\"]\n");
        prompt.append("}\n");

        return prompt.toString();
    }

    private String callGeminiAPI(String prompt) throws IOException, InterruptedException {
        String url = String.format(GEMINI_API_URL, model, apiKey);

        Map<String, Object> requestMap = Map.of(
            "contents", List.of(
                Map.of(
                    "parts", List.of(
                        Map.of("text", prompt)
                    )
                )
            )
        );
        String requestBody = objectMapper.writeValueAsString(requestMap);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() != 200) {
            log.error("Gemini API 응답 오류: status={}, body={}", response.statusCode(), response.body());
            throw new BaseException(ErrorCode.GEMINI_API_ERROR);
        }

        return response.body();
    }

    private AnalysisResult parseResponse(String responseBody) throws IOException {
        JsonNode rootNode = objectMapper.readTree(responseBody);
        JsonNode candidates = rootNode.get("candidates");
        
        if (candidates == null || !candidates.isArray() || candidates.size() == 0) {
            throw new BaseException(ErrorCode.GEMINI_API_ERROR, "Gemini API 응답 형식이 올바르지 않습니다.");
        }

        JsonNode content = candidates.get(0).get("content");
        if (content == null) {
            throw new BaseException(ErrorCode.GEMINI_API_ERROR, "Gemini API 응답에 content가 없습니다.");
        }

        JsonNode parts = content.get("parts");
        if (parts == null || !parts.isArray() || parts.size() == 0) {
            throw new BaseException(ErrorCode.GEMINI_API_ERROR, "Gemini API 응답에 parts가 없습니다.");
        }

        String text = parts.get(0).get("text").asText();
        
        // JSON 부분만 추출 (```json ... ``` 형식 제거)
        text = text.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
        
        JsonNode resultNode = objectMapper.readTree(text);
        
        return AnalysisResult.builder()
                .matchedRouteId(resultNode.get("matchedRouteId").asLong())
                .similarity(resultNode.get("similarity").asInt())
                .reason(resultNode.get("reason").asText())
                .strengths(parseStringArray(resultNode.get("strengths")))
                .weaknesses(parseStringArray(resultNode.get("weaknesses")))
                .recommendations(parseStringArray(resultNode.get("recommendations")))
                .build();
    }

    private List<String> parseStringArray(JsonNode node) {
        if (node == null || !node.isArray()) {
            return List.of();
        }
        return java.util.stream.StreamSupport.stream(node.spliterator(), false)
                .map(JsonNode::asText)
                .collect(Collectors.toList());
    }

    @lombok.Builder
    @lombok.Getter
    public static class AnalysisResult {
        private Long matchedRouteId;
        private Integer similarity;
        private String reason;
        private List<String> strengths;
        private List<String> weaknesses;
        private List<String> recommendations;
    }
}
