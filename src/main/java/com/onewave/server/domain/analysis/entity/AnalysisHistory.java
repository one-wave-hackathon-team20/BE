package com.onewave.server.domain.analysis.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "analysis_history", indexes = {
        @Index(name = "idx_analysis_user_id", columnList = "userId"),
        @Index(name = "idx_analysis_user_created", columnList = "userId, createdAt DESC")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnalysisHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID userId;

    /**
     * 매칭된 합격 사례 route ID (FK: routes.id)
     * TODO: Route 엔티티 구현 후 @ManyToOne 관계로 변경
     */
    @Column(nullable = false)
    private Long matchedRouteId;

    /**
     * 유사도 점수 (0~100 정수)
     */
    @Column
    private Integer similarity;

    /**
     * AI가 판단한 매칭 이유
     */
    @Column(columnDefinition = "TEXT")
    private String reason;

    /**
     * 사용자 강점 (CSV 형태 저장)
     */
    @Column(columnDefinition = "TEXT")
    private String strengths;

    /**
     * 사용자 약점 (CSV 형태 저장)
     */
    @Column(columnDefinition = "TEXT")
    private String weaknesses;

    /**
     * 로드맵 제언 (CSV 형태 저장)
     */
    @Column(columnDefinition = "TEXT")
    private String recommendations;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Builder
    public AnalysisHistory(UUID userId, Long matchedRouteId, Integer similarity,
                           String reason, String strengths, String weaknesses,
                           String recommendations) {
        this.userId = userId;
        this.matchedRouteId = matchedRouteId;
        this.similarity = similarity;
        this.reason = reason;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.recommendations = recommendations;
    }

    // ── CSV ↔ List 변환 헬퍼 ──

    public List<String> getStrengthsList() {
        return splitCsv(strengths);
    }

    public List<String> getWeaknessesList() {
        return splitCsv(weaknesses);
    }

    public List<String> getRecommendationsList() {
        return splitCsv(recommendations);
    }

    private List<String> splitCsv(String value) {
        if (value == null || value.isBlank()) return List.of();
        return List.of(value.split("\\|\\|"));
    }

    public static String joinToCsv(List<String> list) {
        if (list == null || list.isEmpty()) return "";
        return String.join("||", list);
    }
}
