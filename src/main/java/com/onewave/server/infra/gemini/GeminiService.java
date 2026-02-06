package com.onewave.server.infra.gemini;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.onewave.server.global.exception.BaseException;
import com.onewave.server.global.exception.ErrorCode;
import com.onewave.server.infra.gemini.dto.GeminiRequest;
import com.onewave.server.infra.gemini.dto.GeminiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    private final RestClient geminiRestClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.model}")
    private String model;

    /**
     * Gemini API에 텍스트 프롬프트를 전송하고 응답 텍스트를 반환합니다.
     *
     * @param prompt 전송할 프롬프트
     * @return Gemini 응답 텍스트
     */
    public String generateContent(String prompt) {
        GeminiRequest request = GeminiRequest.of(prompt);

        try {
            GeminiResponse response = geminiRestClient.post()
                    .uri("/{model}:generateContent?key={key}", model, apiKey)
                    .body(request)
                    .retrieve()
                    .body(GeminiResponse.class);

            if (response == null) {
                log.error("Gemini API 응답이 null입니다.");
                throw new BaseException(ErrorCode.GEMINI_API_ERROR);
            }

            String text = response.extractText();
            if (text == null || text.isBlank()) {
                log.error("Gemini API 응답에서 텍스트를 추출할 수 없습니다.");
                throw new BaseException(ErrorCode.GEMINI_API_ERROR);
            }

            log.info("Gemini API 호출 성공. 응답 길이: {}", text.length());
            return text;

        } catch (RestClientException e) {
            log.error("Gemini API 호출 실패: {}", e.getMessage(), e);
            throw new BaseException(ErrorCode.GEMINI_API_ERROR);
        }
    }

    /**
     * Gemini API를 호출하고 응답을 지정된 타입으로 파싱합니다.
     *
     * @param prompt 전송할 프롬프트
     * @param responseType 응답을 변환할 타입
     * @return 파싱된 응답 객체
     */
    public <T> T generateContentAs(String prompt, Class<T> responseType) {
        String responseText = generateContent(prompt);

        try {
            return objectMapper.readValue(responseText, responseType);
        } catch (Exception e) {
            log.error("Gemini 응답 파싱 실패. 응답: {}", responseText, e);
            throw new BaseException(ErrorCode.GEMINI_PARSE_ERROR);
        }
    }
}
