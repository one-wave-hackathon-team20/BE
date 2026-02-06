package com.onewave.server.domain.user.dto;

import com.onewave.server.domain.user.entity.UserDetails;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class UserResponse {
    private UUID id;
    private String email;
    private String nickname;
    private Boolean onboardingCompleted;
    private UserDetailsDto userDetails;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class UserDetailsDto {
        private Long id;
        private UserDetails.Job job;
        private UserDetails.Background background;
        private List<String> companySizes;
        private List<String> skills;
        private Integer projects;
        private Boolean intern;
        private Boolean bootcamp;
        private Boolean awards;
    }
}
