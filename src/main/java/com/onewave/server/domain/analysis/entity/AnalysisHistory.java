package com.onewave.server.domain.analysis.entity;

import com.onewave.server.domain.route.entity.Route;
import com.onewave.server.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "analysis_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AnalysisHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matched_route_id", nullable = false)
    private Route matchedRoute;

    private Integer similarity; // 0~100

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String strengths; // JSON/CSV 형태

    @Column(columnDefinition = "TEXT")
    private String weaknesses; // JSON/CSV 형태

    @Column(columnDefinition = "TEXT")
    private String recommendations; // JSON/CSV 형태

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public AnalysisHistory(User user, Route matchedRoute, Integer similarity, String reason,
                          String strengths, String weaknesses, String recommendations) {
        this.user = user;
        this.matchedRoute = matchedRoute;
        this.similarity = similarity;
        this.reason = reason;
        this.strengths = strengths;
        this.weaknesses = weaknesses;
        this.recommendations = recommendations;
    }
}
