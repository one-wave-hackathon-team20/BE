package com.onewave.server.domain.analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 유사도 계산에 사용되는 Route 데이터 표현 DTO
 * TODO: Route 엔티티 구현 후 엔티티에서 변환하도록 변경
 */
@Getter
@Builder
@AllArgsConstructor
public class RouteData {

    private Long id;
    private String job;              // FRONTEND / BACKEND
    private String background;       // MAJOR / NON_MAJOR
    private String finalCompanySize; // STARTUP / SME / MIDSIZE / ENTERPRISE
    private String skills;           // CSV: "react,nextjs,typescript"
    private Integer projects;
    private Boolean intern;
    private Boolean bootcamp;
    private Boolean awards;
    private String summary;

    /**
     * skills를 Set으로 변환 (비교용)
     */
    public Set<String> getSkillSet() {
        if (skills == null || skills.isBlank()) return Set.of();
        return Arrays.stream(skills.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }
}
