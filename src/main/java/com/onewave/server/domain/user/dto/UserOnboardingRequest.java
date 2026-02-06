package com.onewave.server.domain.user.dto;

import com.onewave.server.domain.user.entity.UserDetails;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class UserOnboardingRequest {

    @NotNull(message = "직무는 필수입니다.")
    private UserDetails.Job job;

    @NotNull(message = "전공 여부는 필수입니다.")
    private UserDetails.Background background;

    private List<String> companySizes; // 선호 기업 규모 리스트

    private List<String> skills; // 보유 기술 스택 리스트

    @NotNull(message = "프로젝트 수는 필수입니다.")
    private Integer projects;

    private Boolean intern;

    private Boolean bootcamp;

    private Boolean awards;
}
