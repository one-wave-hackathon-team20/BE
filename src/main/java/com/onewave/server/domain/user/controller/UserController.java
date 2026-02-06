package com.onewave.server.domain.user.controller;

import com.onewave.server.domain.user.dto.UserOnboardingRequest;
import com.onewave.server.domain.user.dto.UserResponse;
import com.onewave.server.domain.user.dto.UserUpdateRequest;
import com.onewave.server.domain.user.service.UserService;
import com.onewave.server.global.response.ApiResponse;
import com.onewave.server.global.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/onboarding")
    public ApiResponse<Void> completeOnboarding(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UserOnboardingRequest request) {
        userService.completeOnboarding(userPrincipal.getUserId(), request);
        return ApiResponse.successWithNoContent("온보딩이 완료되었습니다.");
    }

    @PatchMapping
    public ApiResponse<Void> updateUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UserUpdateRequest request) {
        userService.updateUser(userPrincipal.getUserId(), request);
        return ApiResponse.successWithNoContent("사용자 정보가 수정되었습니다.");
    }

    @GetMapping
    public ApiResponse<UserResponse> getMyInfo(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse response = userService.getMyInfo(userPrincipal.getUserId());
        return ApiResponse.success(response);
    }
}
