package com.onewave.server.domain.route.service;

import com.onewave.server.domain.route.dto.RouteResponse;
import com.onewave.server.domain.route.entity.QRoute;
import com.onewave.server.domain.route.entity.Route;
import com.onewave.server.domain.route.entity.RouteStep;
import com.onewave.server.domain.route.repository.RouteRepository;
import com.onewave.server.domain.user.entity.UserDetails;
import com.onewave.server.global.exception.BaseException;
import com.onewave.server.global.exception.ErrorCode;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RouteService {

    private final RouteRepository routeRepository;
    private final EntityManager entityManager;

    private JPAQueryFactory getQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }

    public List<RouteResponse> getRoutes(UserDetails.Job job, UserDetails.Background background) {
        QRoute route = QRoute.route;
        BooleanBuilder builder = new BooleanBuilder();

        if (job != null) {
            builder.and(route.job.eq(convertJob(job)));
        }
        if (background != null) {
            builder.and(route.background.eq(convertBackground(background)));
        }

        List<Route> routes = getQueryFactory()
                .selectFrom(route)
                .where(builder)
                .fetch();

        return routes.stream()
                .map(this::toRouteResponse)
                .collect(Collectors.toList());
    }

    public RouteResponse getRouteById(Long routeId) {
        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new BaseException(ErrorCode.ROUTE_NOT_FOUND));

        return toRouteResponse(route);
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    private RouteResponse toRouteResponse(Route route) {
        List<RouteResponse.RouteStepResponse> routeSteps = route.getRouteSteps().stream()
                .map(step -> RouteResponse.RouteStepResponse.builder()
                        .id(step.getId())
                        .stepOrder(step.getStepOrder())
                        .title(step.getTitle())
                        .description(step.getDescription())
                        .duration(step.getDuration())
                        .tips(step.getTips())
                        .build())
                .collect(Collectors.toList());

        return RouteResponse.builder()
                .id(route.getId())
                .job(route.getJob())
                .background(route.getBackground())
                .finalCompanySize(route.getFinalCompanySize())
                .skills(parseSkills(route.getSkills()))
                .projects(route.getProjects())
                .intern(route.getIntern())
                .bootcamp(route.getBootcamp())
                .awards(route.getAwards())
                .summary(route.getSummary())
                .routeSteps(routeSteps)
                .build();
    }

    private List<String> parseSkills(String skills) {
        if (skills == null || skills.isBlank()) {
            return List.of();
        }
        return Arrays.stream(skills.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .collect(Collectors.toList());
    }

    private Route.Job convertJob(UserDetails.Job job) {
        return Route.Job.valueOf(job.name());
    }

    private Route.Background convertBackground(UserDetails.Background background) {
        return Route.Background.valueOf(background.name());
    }
}
