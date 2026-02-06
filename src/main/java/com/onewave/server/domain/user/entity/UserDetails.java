package com.onewave.server.domain.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_details")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Job job;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Background background;

    @Column(name = "company_sizes")
    private String companySizes; // CSV 형태

    private String skills; // CSV 형태

    @Column(nullable = false)
    private Integer projects = 0;

    private Boolean intern;

    private Boolean bootcamp;

    private Boolean awards;

    @Builder
    public UserDetails(User user, Job job, Background background, String companySizes,
                      String skills, Integer projects, Boolean intern, Boolean bootcamp, Boolean awards) {
        this.user = user;
        this.job = job;
        this.background = background;
        this.companySizes = companySizes;
        this.skills = skills;
        this.projects = projects != null ? projects : 0;
        this.intern = intern;
        this.bootcamp = bootcamp;
        this.awards = awards;
    }

    public void update(Job job, Background background, String companySizes,
                      String skills, Integer projects, Boolean intern, Boolean bootcamp, Boolean awards) {
        this.job = job;
        this.background = background;
        this.companySizes = companySizes;
        this.skills = skills;
        this.projects = projects != null ? projects : 0;
        this.intern = intern;
        this.bootcamp = bootcamp;
        this.awards = awards;
    }

    public enum Job {
        FRONTEND, BACKEND
    }

    public enum Background {
        MAJOR, NON_MAJOR
    }
}
