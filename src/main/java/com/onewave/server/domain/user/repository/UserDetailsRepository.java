package com.onewave.server.domain.user.repository;

import com.onewave.server.domain.user.entity.User;
import com.onewave.server.domain.user.entity.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserDetailsRepository extends JpaRepository<UserDetails, Long> {
    Optional<UserDetails> findByUser(User user);
    Optional<UserDetails> findByUserId(UUID userId);
    boolean existsByUser(User user);
}
