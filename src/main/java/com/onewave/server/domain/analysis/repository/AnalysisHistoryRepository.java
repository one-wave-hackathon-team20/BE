package com.onewave.server.domain.analysis.repository;

import com.onewave.server.domain.analysis.entity.AnalysisHistory;
import com.onewave.server.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AnalysisHistoryRepository extends JpaRepository<AnalysisHistory, Long> {
    Optional<AnalysisHistory> findTopByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<AnalysisHistory> findTopByUserOrderByCreatedAtDesc(User user);
}
