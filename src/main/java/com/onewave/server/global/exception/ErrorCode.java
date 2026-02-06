package com.onewave.server.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Common
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C001", "서버 내부 오류가 발생했습니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C002", "잘못된 입력값입니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C003", "허용되지 않은 메서드입니다."),
    INVALID_TYPE_VALUE(HttpStatus.BAD_REQUEST, "C004", "잘못된 타입입니다."),

    // Auth
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "A001", "이미 존재하는 이메일입니다."),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "A002", "이메일 또는 비밀번호가 올바르지 않습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "A003", "유효하지 않은 토큰입니다."),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "A004", "토큰이 만료되었습니다."),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    INVALID_USER_ID(HttpStatus.BAD_REQUEST, "U002", "잘못된 사용자 ID 형식입니다."),
    USER_NOT_AUTHORIZED(HttpStatus.FORBIDDEN, "U003", "해당 리소스에 접근할 수 없습니다."),
    USER_DETAILS_NOT_FOUND(HttpStatus.NOT_FOUND, "U004", "사용자 상세 정보를 찾을 수 없습니다."),
    ONBOARDING_ALREADY_COMPLETED(HttpStatus.BAD_REQUEST, "U005", "이미 온보딩이 완료되었습니다."),

    // Route
    ROUTE_NOT_FOUND(HttpStatus.NOT_FOUND, "R001", "합격 사례를 찾을 수 없습니다."),

    // Analysis
    ANALYSIS_NOT_FOUND(HttpStatus.NOT_FOUND, "AN001", "분석 결과를 찾을 수 없습니다."),

    // AI
    GEMINI_API_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "AI001", "Gemini API 호출에 실패했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
