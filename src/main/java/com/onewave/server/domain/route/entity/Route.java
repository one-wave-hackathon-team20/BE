package com.onewave.server.domain.route.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "routes")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Job job;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Background background;

    @Column(name = "final_company_size", nullable = false)
    private String finalCompanySize;

    private String skills; // CSV 형태

    private Integer projects;

    private Boolean intern;

    private Boolean bootcamp;

    private Boolean awards;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("stepOrder ASC")
    private List<RouteStep> routeSteps = new ArrayList<>();

    @Builder
    public Route(Job job, Background background, String finalCompanySize, String skills,
                Integer projects, Boolean intern, Boolean bootcamp, Boolean awards, String summary) {
        this.job = job;
        this.background = background;
        this.finalCompanySize = finalCompanySize;
        this.skills = skills;
        this.projects = projects;
        this.intern = intern;
        this.bootcamp = bootcamp;
        this.awards = awards;
        this.summary = summary;
    }

    public void addRouteStep(RouteStep routeStep) {
        this.routeSteps.add(routeStep);
        routeStep.setRoute(this);
    }

    public enum Job {
        FRONTEND, BACKEND
    }

    public enum Background {
        MAJOR, NON_MAJOR
    }
}
