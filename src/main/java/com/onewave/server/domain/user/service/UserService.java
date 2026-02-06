package com.onewave.server.domain.user.service;

import com.onewave.server.domain.user.dto.UserOnboardingRequest;
import com.onewave.server.domain.user.dto.UserResponse;
import com.onewave.server.domain.user.dto.UserUpdateRequest;
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
public class UserService {

    private final UserRepository userRepository;
    private final UserDetailsRepository userDetailsRepository;

    @Transactional
    public void completeOnboarding(UUID userId, UserOnboardingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        if (user.getOnboardingCompleted()) {
            throw new BaseException(ErrorCode.ONBOARDING_ALREADY_COMPLETED);
        }

        // UserDetails 생성
        UserDetails userDetails = UserDetails.builder()
                .user(user)
                .job(request.getJob())
                .background(request.getBackground())
                .companySizes(convertListToString(request.getCompanySizes()))
                .skills(convertListToString(request.getSkills()))
                .projects(request.getProjects())
                .intern(request.getIntern())
                .bootcamp(request.getBootcamp())
                .awards(request.getAwards())
                .build();

        userDetailsRepository.save(userDetails);
        user.completeOnboarding();
    }

    @Transactional
    public void updateUser(UUID userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        // 닉네임 업데이트
        if (request.getNickname() != null && !request.getNickname().isBlank()) {
            user.updateNickname(request.getNickname());
        }

        // UserDetails 업데이트
        UserDetails userDetails = userDetailsRepository.findByUser(user)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_DETAILS_NOT_FOUND));

        userDetails.update(
                request.getJob() != null ? request.getJob() : userDetails.getJob(),
                request.getBackground() != null ? request.getBackground() : userDetails.getBackground(),
                request.getCompanySizes() != null ? convertListToString(request.getCompanySizes()) : userDetails.getCompanySizes(),
                request.getSkills() != null ? convertListToString(request.getSkills()) : userDetails.getSkills(),
                request.getProjects() != null ? request.getProjects() : userDetails.getProjects(),
                request.getIntern() != null ? request.getIntern() : userDetails.getIntern(),
                request.getBootcamp() != null ? request.getBootcamp() : userDetails.getBootcamp(),
                request.getAwards() != null ? request.getAwards() : userDetails.getAwards()
        );

        // 분석 결과 무효화 처리는 AnalysisService에서 처리
    }

    public UserResponse getMyInfo(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

        UserDetails userDetails = userDetailsRepository.findByUser(user).orElse(null);

        UserResponse.UserDetailsDto userDetailsDto = null;
        if (userDetails != null) {
            userDetailsDto = UserResponse.UserDetailsDto.builder()
                    .id(userDetails.getId())
                    .job(userDetails.getJob())
                    .background(userDetails.getBackground())
                    .companySizes(convertStringToList(userDetails.getCompanySizes()))
                    .skills(convertStringToList(userDetails.getSkills()))
                    .projects(userDetails.getProjects())
                    .intern(userDetails.getIntern())
                    .bootcamp(userDetails.getBootcamp())
                    .awards(userDetails.getAwards())
                    .build();
        }

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .onboardingCompleted(user.getOnboardingCompleted())
                .userDetails(userDetailsDto)
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
