package com.onewave.server.domain.auth.controller;

import com.onewave.server.domain.auth.dto.AuthRequest;
import com.onewave.server.domain.auth.dto.AuthResponse;
import com.onewave.server.domain.auth.service.AuthService;
import com.onewave.server.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ApiResponse<AuthResponse> signup(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.signup(request);
        return ApiResponse.success("회원가입이 완료되었습니다.", response);
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ApiResponse.success("로그인에 성공했습니다.", response);
    }
}
