package com.onewave.server.domain.route.dto;

import com.onewave.server.domain.route.entity.Route;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class RouteResponse {
    private Long id;
    private Route.Job job;
    private Route.Background background;
    private String finalCompanySize;
    private List<String> skills;
    private Integer projects;
    private Boolean intern;
    private Boolean bootcamp;
    private Boolean awards;
    private String summary;
    private List<RouteStepResponse> routeSteps;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class RouteStepResponse {
        private Long id;
        private Integer stepOrder;
        private String title;
        private String description;
        private String duration;
        private String tips;
    }
}
