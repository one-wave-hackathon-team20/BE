package com.onewave.server.domain.analysis.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ai_analysis_results", indexes = {
        @Index(name = "idx_analysis_user_id", columnList = "userId"),
        @Index(name = "idx_analysis_user_created", columnList = "userId, createdAt DESC")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnalysisResult {

    @Id
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;

    @Column(nullable = false)
    private UUID userId;

    // AI Insight - reason
    @Column(columnDefinition = "TEXT")
    private String insightReason;

    // AI Insight - strengths (쉼표 구분 저장)
    @Column(columnDefinition = "TEXT")
    private String insightStrengths;

    // AI Insight - weaknesses (쉼표 구분 저장)
    @Column(columnDefinition = "TEXT")
    private String insightWeaknesses;

    // AI Insight - recommendations (쉼표 구분 저장)
    @Column(columnDefinition = "TEXT")
    private String insightRecommendations;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "analysisResult", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("rank ASC")
    private List<AnalysisMatchedRoute> matchedRoutes = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Builder
    public AnalysisResult(UUID userId, String insightReason,
                          String insightStrengths, String insightWeaknesses,
                          String insightRecommendations) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.insightReason = insightReason;
        this.insightStrengths = insightStrengths;
        this.insightWeaknesses = insightWeaknesses;
        this.insightRecommendations = insightRecommendations;
    }

    public void addMatchedRoute(AnalysisMatchedRoute route) {
        this.matchedRoutes.add(route);
        route.setAnalysisResult(this);
    }

    // 구분자 기반 List 변환 헬퍼
    public List<String> getStrengthsList() {
        return splitToList(insightStrengths);
    }

    public List<String> getWeaknessesList() {
        return splitToList(insightWeaknesses);
    }

    public List<String> getRecommendationsList() {
        return splitToList(insightRecommendations);
    }

    private List<String> splitToList(String value) {
        if (value == null || value.isBlank()) return List.of();
        return List.of(value.split("\\|\\|"));
    }

    public static String joinFromList(List<String> list) {
        if (list == null || list.isEmpty()) return "";
        return String.join("||", list);
    }
}
