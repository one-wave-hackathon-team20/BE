package com.onewave.server.domain.analysis.repository;

import com.onewave.server.domain.analysis.entity.AnalysisResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AnalysisResultRepository extends JpaRepository<AnalysisResult, String> {

    /**
     * 특정 사용자의 가장 최근 분석 결과 조회
     */
    Optional<AnalysisResult> findTopByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * 특정 사용자의 분석 이력 목록 조회 (페이지네이션)
     */
    Page<AnalysisResult> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);
}
