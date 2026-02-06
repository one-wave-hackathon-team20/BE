package com.onewave.server.domain.analysis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 유사도 계산에 사용되는 사용자 프로필 데이터 표현 DTO
 * TODO: UserDetail 엔티티 구현 후 엔티티에서 변환하도록 변경
 */
@Getter
@Builder
@AllArgsConstructor
public class UserProfileData {

    private String job;              // FRONTEND / BACKEND
    private String background;       // MAJOR / NON_MAJOR
    private String companySizes;     // CSV: "STARTUP,SME"
    private String skills;           // CSV: "react,nextjs,typescript"
    private Integer projects;
    private Boolean intern;
    private Boolean bootcamp;
    private Boolean awards;

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

    /**
     * companySizes를 Set으로 변환 (비교용)
     */
    public Set<String> getCompanySizeSet() {
        if (companySizes == null || companySizes.isBlank()) return Set.of();
        return Arrays.stream(companySizes.split(","))
                .map(String::trim)
                .map(String::toUpperCase)
                .collect(Collectors.toSet());
    }
}
