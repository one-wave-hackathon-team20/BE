package com.onewave.server.domain.user.dto;

import com.onewave.server.domain.user.entity.UserDetails;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class UserUpdateRequest {

    private UserDetails.Job job;

    private UserDetails.Background background;

    private List<String> companySizes;

    private List<String> skills;

    private Integer projects;

    private Boolean intern;

    private Boolean bootcamp;

    private Boolean awards;

    private String nickname;
}
