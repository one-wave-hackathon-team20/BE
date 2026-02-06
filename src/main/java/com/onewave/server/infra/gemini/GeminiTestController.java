package com.onewave.server.infra.gemini;

import com.onewave.server.global.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Gemini API 연동 테스트용 컨트롤러입니다.
 * 운영 배포 전에 제거하거나 @Profile("dev")로 제한하세요.
 */
@Tag(name = "Gemini Test", description = "Gemini API 연동 테스트")
@RestController
@RequestMapping("/api/test/gemini")
@RequiredArgsConstructor
public class GeminiTestController {

    private final GeminiService geminiService;

    @Operation(summary = "Gemini API 연결 테스트", description = "간단한 프롬프트로 Gemini API 응답 확인")
    @GetMapping("/ping")
    public ResponseEntity<ApiResponse<Map<String, String>>> ping() {
        String response = geminiService.generateContent("안녕? 한 문장으로 짧게 대답해줘.");
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "prompt", "안녕? 한 문장으로 짧게 대답해줘.",
                "response", response
        )));
    }

    @Operation(summary = "커스텀 프롬프트 테스트", description = "직접 프롬프트를 입력하여 Gemini API 테스트")
    @GetMapping("/ask")
    public ResponseEntity<ApiResponse<Map<String, String>>> ask(
            @RequestParam String prompt) {
        String response = geminiService.generateContent(prompt);
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "prompt", prompt,
                "response", response
        )));
    }
}
