package com.onewave.server.domain.route.repository;

import com.onewave.server.domain.route.entity.Route;
import com.onewave.server.domain.user.entity.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Long>, QuerydslPredicateExecutor<Route> {
    List<Route> findAll();
}
