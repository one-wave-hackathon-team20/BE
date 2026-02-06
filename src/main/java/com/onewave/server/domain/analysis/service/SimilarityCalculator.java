package com.onewave.server.domain.analysis.service;

import com.onewave.server.domain.analysis.dto.RouteData;
import com.onewave.server.domain.analysis.dto.UserProfileData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * 사용자 프로필과 합격 루트 간의 유사도를 계산합니다.
 *
 * <h3>방식: 피처 벡터화 → 가중 코사인 유사도 (Weighted Cosine Similarity)</h3>
 *
 * <p>각 프로필/루트 데이터를 수치 벡터로 인코딩한 뒤, 피처 그룹별 가중치를 적용하고
 * 코사인 유사도를 계산합니다.</p>
 *
 * <h4>피처 인코딩 방식</h4>
 * <ul>
 *   <li>카테고리 (background): 이진 인코딩 (MAJOR=1, NON_MAJOR=0)</li>
 *   <li>기업 규모 (companySize): 멀티핫 인코딩 [STARTUP, SME, MIDSIZE, ENTERPRISE]</li>
 *   <li>기술 스택 (skills): 멀티핫 인코딩 (전체 스킬 어휘 기반)</li>
 *   <li>수치 (projects): Min-Max 정규화 (0~1)</li>
 *   <li>불리언 (intern, bootcamp, awards): 0 또는 1</li>
 * </ul>
 *
 * <h4>피처 그룹별 가중치</h4>
 * <ul>
 *   <li>직무 (job): 필수 조건 — 불일치 시 해당 루트 제외</li>
 *   <li>전공 (background): 1.5</li>
 *   <li>기업 규모 (companySize): 1.0</li>
 *   <li>기술 스택 (skills): 3.0</li>
 *   <li>프로젝트 수 (projects): 1.5</li>
 *   <li>경험 (intern, bootcamp, awards): 각 1.0</li>
 * </ul>
 */
@Slf4j
@Component
public class SimilarityCalculator {

    // ── 피처 그룹별 가중치 ──
    private static final double W_BACKGROUND = 1.5;
    private static final double W_COMPANY_SIZE = 1.0;
    private static final double W_SKILLS = 3.0;
    private static final double W_PROJECTS = 1.5;
    private static final double W_INTERN = 1.0;
    private static final double W_BOOTCAMP = 1.0;
    private static final double W_AWARDS = 1.0;

    // 기업 규모 인코딩 순서
    private static final List<String> COMPANY_SIZE_ORDER = List.of("STARTUP", "SME", "MIDSIZE", "ENTERPRISE");

    // 프로젝트 수 정규화 기준 (최대값)
    private static final double MAX_PROJECTS = 10.0;

    /**
     * 사용자 프로필과 모든 루트 중 가장 유사한 루트를 찾습니다.
     *
     * @return routeId와 similarity(0~100)를 담은 결과, 매칭 루트가 없으면 empty
     */
    public Optional<MatchResult> findBestMatch(UserProfileData user, List<RouteData> routes) {
        // 직무 필터링
        List<RouteData> filtered = routes.stream()
                .filter(route -> route.getJob().equalsIgnoreCase(user.getJob()))
                .toList();

        if (filtered.isEmpty()) {
            return Optional.empty();
        }

        // 전체 스킬 어휘 구축 (사용자 + 필터된 모든 routes)
        List<String> skillVocabulary = buildSkillVocabulary(user, filtered);

        // 사용자 벡터 생성
        double[] userVector = buildUserVector(user, skillVocabulary);

        // 각 route에 대해 코사인 유사도 계산
        return filtered.stream()
                .map(route -> {
                    double[] routeVector = buildRouteVector(route, user, skillVocabulary);
                    double cosine = cosineSimilarity(userVector, routeVector);
                    int score = (int) Math.round(cosine * 100);
                    log.debug("코사인 유사도 계산. routeId={}, cosine={:.4f}, score={}",
                            route.getId(), cosine, score);
                    return new MatchResult(route.getId(), score);
                })
                .max(Comparator.comparingInt(MatchResult::similarity));
    }

    /**
     * 사용자 프로필과 특정 루트 간의 유사도 점수를 계산합니다.
     *
     * @return 0~100 사이 정수 점수
     */
    public int calculate(UserProfileData user, RouteData route) {
        if (!route.getJob().equalsIgnoreCase(user.getJob())) {
            return 0;
        }

        List<String> skillVocabulary = buildSkillVocabulary(user, List.of(route));
        double[] userVector = buildUserVector(user, skillVocabulary);
        double[] routeVector = buildRouteVector(route, user, skillVocabulary);

        double cosine = cosineSimilarity(userVector, routeVector);
        return (int) Math.round(cosine * 100);
    }

    // ── 피처 벡터 생성 ──────────────────────────────────────────

    /**
     * 사용자 프로필을 가중 피처 벡터로 변환합니다.
     *
     * 벡터 구조: [background | companySize(4) | skills(N) | projects | intern | bootcamp | awards]
     */
    private double[] buildUserVector(UserProfileData user, List<String> skillVocabulary) {
        List<Double> vector = new ArrayList<>();

        // 1. background (이진) × 가중치
        double bg = "MAJOR".equalsIgnoreCase(user.getBackground()) ? 1.0 : 0.0;
        vector.add(bg * W_BACKGROUND);

        // 2. companySize (멀티핫) × 가중치
        Set<String> userSizes = user.getCompanySizeSet();
        for (String size : COMPANY_SIZE_ORDER) {
            vector.add((userSizes.contains(size) ? 1.0 : 0.0) * W_COMPANY_SIZE);
        }

        // 3. skills (멀티핫) × 가중치
        Set<String> userSkills = user.getSkillSet();
        for (String skill : skillVocabulary) {
            vector.add((userSkills.contains(skill) ? 1.0 : 0.0) * W_SKILLS);
        }

        // 4. projects (정규화) × 가중치
        double normalizedProjects = Math.min((user.getProjects() != null ? user.getProjects() : 0) / MAX_PROJECTS, 1.0);
        vector.add(normalizedProjects * W_PROJECTS);

        // 5. boolean 피처들 × 각 가중치
        vector.add((Boolean.TRUE.equals(user.getIntern()) ? 1.0 : 0.0) * W_INTERN);
        vector.add((Boolean.TRUE.equals(user.getBootcamp()) ? 1.0 : 0.0) * W_BOOTCAMP);
        vector.add((Boolean.TRUE.equals(user.getAwards()) ? 1.0 : 0.0) * W_AWARDS);

        return vector.stream().mapToDouble(Double::doubleValue).toArray();
    }

    /**
     * 합격 루트를 가중 피처 벡터로 변환합니다.
     * companySize는 route의 finalCompanySize를 사용자의 선호 기업 규모 관점에서 인코딩합니다.
     */
    private double[] buildRouteVector(RouteData route, UserProfileData user, List<String> skillVocabulary) {
        List<Double> vector = new ArrayList<>();

        // 1. background (이진) × 가중치
        double bg = "MAJOR".equalsIgnoreCase(route.getBackground()) ? 1.0 : 0.0;
        vector.add(bg * W_BACKGROUND);

        // 2. companySize × 가중치
        // route는 finalCompanySize 하나만 가짐 → 해당 위치만 1
        String routeSize = route.getFinalCompanySize().toUpperCase();
        for (String size : COMPANY_SIZE_ORDER) {
            vector.add((size.equals(routeSize) ? 1.0 : 0.0) * W_COMPANY_SIZE);
        }

        // 3. skills (멀티핫) × 가중치
        Set<String> routeSkills = route.getSkillSet();
        for (String skill : skillVocabulary) {
            vector.add((routeSkills.contains(skill) ? 1.0 : 0.0) * W_SKILLS);
        }

        // 4. projects (정규화) × 가중치
        double normalizedProjects = Math.min((route.getProjects() != null ? route.getProjects() : 0) / MAX_PROJECTS, 1.0);
        vector.add(normalizedProjects * W_PROJECTS);

        // 5. boolean 피처들 × 각 가중치
        vector.add((Boolean.TRUE.equals(route.getIntern()) ? 1.0 : 0.0) * W_INTERN);
        vector.add((Boolean.TRUE.equals(route.getBootcamp()) ? 1.0 : 0.0) * W_BOOTCAMP);
        vector.add((Boolean.TRUE.equals(route.getAwards()) ? 1.0 : 0.0) * W_AWARDS);

        return vector.stream().mapToDouble(Double::doubleValue).toArray();
    }

    // ── 코사인 유사도 계산 ──────────────────────────────────────

    /**
     * 두 벡터 간의 코사인 유사도를 계산합니다.
     *
     * cosine(A, B) = (A · B) / (‖A‖ × ‖B‖)
     *
     * @return 0.0 ~ 1.0 사이 값 (1.0 = 완전 일치)
     */
    private double cosineSimilarity(double[] vectorA, double[] vectorB) {
        if (vectorA.length != vectorB.length) {
            throw new IllegalArgumentException("벡터 길이가 다릅니다: " + vectorA.length + " vs " + vectorB.length);
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += vectorA[i] * vectorA[i];
            normB += vectorB[i] * vectorB[i];
        }

        double denominator = Math.sqrt(normA) * Math.sqrt(normB);

        if (denominator == 0.0) {
            return 0.0; // 제로 벡터 방지
        }

        return Math.max(0.0, Math.min(1.0, dotProduct / denominator));
    }

    // ── 스킬 어휘 구축 ──────────────────────────────────────────

    /**
     * 사용자 + 전체 routes의 스킬을 합쳐 어휘(vocabulary)를 구축합니다.
     * 멀티핫 인코딩의 차원을 결정합니다.
     */
    private List<String> buildSkillVocabulary(UserProfileData user, List<RouteData> routes) {
        Set<String> vocabulary = new TreeSet<>(user.getSkillSet());
        for (RouteData route : routes) {
            vocabulary.addAll(route.getSkillSet());
        }
        return new ArrayList<>(vocabulary);
    }

    /**
     * 유사도 계산 결과
     */
    public record MatchResult(Long routeId, int similarity) {}
}
