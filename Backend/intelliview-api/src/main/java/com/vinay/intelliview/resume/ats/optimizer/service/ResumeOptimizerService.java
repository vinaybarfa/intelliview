package com.vinay.intelliview.resume.ats.optimizer.service;

import com.vinay.intelliview.exception.ResourceNotFoundException;
import com.vinay.intelliview.resume.ats.AtsEngine;
import com.vinay.intelliview.resume.ats.AtsResult;
import com.vinay.intelliview.resume.ats.optimizer.ai.ResumeOptimizationProvider;
import com.vinay.intelliview.resume.ats.optimizer.domain.ResumeOptimizationRequest;
import com.vinay.intelliview.resume.ats.optimizer.domain.ResumeOptimizationResult;
import com.vinay.intelliview.resume.ats.optimizer.dto.ResumeOptimizationResponse;
import com.vinay.intelliview.resume.ats.optimizer.dto.SectionRecommendationResponse;
import com.vinay.intelliview.resume.ats.profile.AtsProfile;
import com.vinay.intelliview.resume.ats.profile.ProfileLoader;
import com.vinay.intelliview.resume.entity.Resume;
import com.vinay.intelliview.resume.repository.ResumeRepository;
import com.vinay.intelliview.user.entity.User;
import com.vinay.intelliview.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ResumeOptimizerService {

    private final ResumeRepository resumeRepository;
    private final UserService userService;
    private final ProfileLoader profileLoader;
    private final AtsEngine atsEngine;
    private final ResumeOptimizationProvider optimizationProvider;

    public ResumeOptimizationResponse optimizeResume(
            Long resumeId,
            String email
    ) {

        User user = userService.findByEmail(email);
        Resume resume = resumeRepository.findByIdAndUser(resumeId, user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Resume not found."
                ));

        AtsProfile profile = profileLoader.load(resume.getTargetRole());
        AtsResult atsResult = atsEngine.analyze(
                resume.getExtractedText(),
                profile
        );

        Map<String, Integer> categoryScores =
                calculateCategoryScores(atsResult);
        Map<String, String> categoryStatus =
                calculateCategoryStatus(categoryScores);
        int overallScore = calculateOverallScore(categoryScores);

        ResumeOptimizationResult result = optimizationProvider.optimize(
                ResumeOptimizationRequest.builder()
                        .resumeText(resume.getExtractedText())
                        .targetRole(resume.getTargetRole())
                        .overallScore(overallScore)
                        .categoryScores(categoryScores)
                        .categoryStatus(categoryStatus)
                        .strengths(atsResult.getStrengths())
                        .improvements(atsResult.getImprovements())
                        .priorityImprovements(buildPriorityImprovements(
                                categoryStatus,
                                atsResult.getMissingSkills()
                        ))
                        .matchedSkills(atsResult.getMatchedSkills())
                        .missingSkills(atsResult.getMissingSkills())
                        .matchedEducation(atsResult.getMatchedEducation())
                        .missingEducation(atsResult.getMissingEducation())
                        .matchedExperience(atsResult.getMatchedExperience())
                        .missingExperience(atsResult.getMissingExperience())
                        .matchedProjects(atsResult.getMatchedProjects())
                        .missingProjects(atsResult.getMissingProjects())
                        .matchedCertifications(
                                atsResult.getMatchedCertifications()
                        )
                        .missingCertifications(
                                atsResult.getMissingCertifications()
                        )
                        .build()
        );

        return ResumeOptimizationResponse.builder()
                .resumeId(resume.getId())
                .targetRole(resume.getTargetRole())
                .overallAssessment(result.getOverallAssessment())
                .keyWeaknesses(result.getKeyWeaknesses())
                .priorityRecommendations(result.getPriorityRecommendations())
                .sectionRecommendations(result.getSectionRecommendations()
                        .stream()
                        .map(section -> SectionRecommendationResponse.builder()
                                .section(section.getSection())
                                .recommendations(section.getRecommendations())
                                .build())
                        .toList())
                .provider(result.getProvider())
                .build();
    }

    private Map<String, Integer> calculateCategoryScores(
            AtsResult atsResult
    ) {

        Map<String, Integer> categoryScores = new LinkedHashMap<>();

        addCategoryScore(categoryScores, "SKILLS",
                atsResult.getMatchedSkills(), atsResult.getMissingSkills());
        addCategoryScore(categoryScores, "EDUCATION",
                atsResult.getMatchedEducation(), atsResult.getMissingEducation());
        addCategoryScore(categoryScores, "EXPERIENCE",
                atsResult.getMatchedExperience(), atsResult.getMissingExperience());
        addCategoryScore(categoryScores, "PROJECTS",
                atsResult.getMatchedProjects(), atsResult.getMissingProjects());
        addCategoryScore(categoryScores, "CERTIFICATIONS",
                atsResult.getMatchedCertifications(),
                atsResult.getMissingCertifications());

        return categoryScores;
    }

    private void addCategoryScore(
            Map<String, Integer> categoryScores,
            String category,
            List<String> matchedItems,
            List<String> missingItems
    ) {
        int assessedItems = matchedItems.size() + missingItems.size();

        if (assessedItems == 0) {
            return;
        }

        int score = (int) Math.round(
                (matchedItems.size() * 100.0) / assessedItems
        );
        categoryScores.put(category, score);
    }

    private Map<String, String> calculateCategoryStatus(
            Map<String, Integer> categoryScores
    ) {
        Map<String, String> categoryStatus = new LinkedHashMap<>();
        categoryScores.forEach((category, score) -> categoryStatus.put(
                category,
                getCategoryStatus(score)
        ));
        return categoryStatus;
    }

    private String getCategoryStatus(int score) {
        if (score >= 80) {
            return "GOOD";
        }
        if (score >= 50) {
            return "AVERAGE";
        }
        return "NEEDS_IMPROVEMENT";
    }

    private int calculateOverallScore(
            Map<String, Integer> categoryScores
    ) {
        return (int) Math.round(categoryScores.values().stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0));
    }

    private List<String> buildPriorityImprovements(
            Map<String, String> categoryStatus,
            List<String> missingSkills
    ) {
        Set<String> priorityImprovements = new LinkedHashSet<>();
        categoryStatus.forEach((category, status) -> {
            if ("NEEDS_IMPROVEMENT".equals(status)) {
                priorityImprovements.add(
                        "Improve " + category.toLowerCase() + " coverage."
                );
            }
        });
        missingSkills.forEach(skill -> priorityImprovements.add(
                "Add required skill: " + skill
        ));
        return List.copyOf(priorityImprovements);
    }
}