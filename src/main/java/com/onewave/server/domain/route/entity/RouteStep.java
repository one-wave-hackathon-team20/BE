package com.onewave.server.domain.route.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "route_steps")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RouteStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    @Setter
    private Route route;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String duration;

    @Column(columnDefinition = "TEXT")
    private String tips;

    public RouteStep(Integer stepOrder, String title, String description, String duration, String tips) {
        this.stepOrder = stepOrder;
        this.title = title;
        this.description = description;
        this.duration = duration;
        this.tips = tips;
    }
}
