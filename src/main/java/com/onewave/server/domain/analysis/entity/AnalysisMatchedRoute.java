package com.onewave.server.domain.analysis.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "analysis_matched_routes", indexes = {
        @Index(name = "idx_matched_routes_analysis", columnList = "analysis_result_id")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnalysisMatchedRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "analysis_result_id", nullable = false)
    private AnalysisResult analysisResult;

    @Column(nullable = false)
    private Long routeId;

    @Column(nullable = false)
    private Double similarity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false, length = 50)
    private String job;

    @Column(nullable = false, length = 50)
    private String finalCompanySize;

    @Column(nullable = false)
    private Integer rank;

    @Builder
    public AnalysisMatchedRoute(Long routeId, Double similarity, String summary,
                                 String job, String finalCompanySize, Integer rank) {
        this.routeId = routeId;
        this.similarity = similarity;
        this.summary = summary;
        this.job = job;
        this.finalCompanySize = finalCompanySize;
        this.rank = rank;
    }

    void setAnalysisResult(AnalysisResult analysisResult) {
        this.analysisResult = analysisResult;
    }
}
