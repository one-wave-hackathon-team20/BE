package com.onewave.server.domain.analysis.repository;

import com.onewave.server.domain.analysis.entity.AnalysisHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AnalysisHistoryRepository extends JpaRepository<AnalysisHistory, Long> {

    /**
     * 특정 사용자의 가장 최근 분석 결과 조회
     */
    Optional<AnalysisHistory> findTopByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * 특정 사용자의 분석 결과 존재 여부 확인
     */
    boolean existsByUserId(UUID userId);

    /**
     * 특정 사용자의 분석 이력 전체 삭제 (스펙 수정 시 무효화용)
     */
    void deleteAllByUserId(UUID userId);
}
