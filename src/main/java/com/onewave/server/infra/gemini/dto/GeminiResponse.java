package com.onewave.server.infra.gemini.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class GeminiResponse {

    private List<Candidate> candidates;

    @Getter
    @NoArgsConstructor
    public static class Candidate {
        private Content content;
    }

    @Getter
    @NoArgsConstructor
    public static class Content {
        private List<Part> parts;
        private String role;
    }

    @Getter
    @NoArgsConstructor
    public static class Part {
        private String text;
    }

    /**
     * 응답에서 텍스트를 추출합니다.
     */
    public String extractText() {
        if (candidates == null || candidates.isEmpty()) {
            return null;
        }
        Candidate candidate = candidates.get(0);
        if (candidate.getContent() == null || candidate.getContent().getParts() == null
                || candidate.getContent().getParts().isEmpty()) {
            return null;
        }
        return candidate.getContent().getParts().get(0).getText();
    }
}
