package com.onewave.server.domain.route.controller;

import com.onewave.server.domain.route.dto.RouteResponse;
import com.onewave.server.domain.route.service.RouteService;
import com.onewave.server.domain.user.entity.UserDetails;
import com.onewave.server.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping
    public ApiResponse<List<RouteResponse>> getRoutes(
            @RequestParam(required = false) UserDetails.Job job,
            @RequestParam(required = false) UserDetails.Background background) {
        List<RouteResponse> routes = routeService.getRoutes(job, background);
        return ApiResponse.success(routes);
    }

    @GetMapping("/{id}")
    public ApiResponse<RouteResponse> getRouteById(@PathVariable Long id) {
        RouteResponse route = routeService.getRouteById(id);
        return ApiResponse.success(route);
    }
}
