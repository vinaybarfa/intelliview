package com.vinay.intelliview.resume.ats.optimizer.ai;

import com.vinay.intelliview.resume.ats.optimizer.domain.ResumeOptimizationRequest;
import com.vinay.intelliview.resume.ats.optimizer.domain.ResumeOptimizationResult;
import com.vinay.intelliview.resume.ats.optimizer.domain.SectionRecommendation;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Component
@ConditionalOnProperty(
        prefix = "intelliview.ai",
        name = "provider",
        havingValue = "placeholder",
        matchIfMissing = true
)
public class PlaceholderResumeOptimizationProvider
        implements ResumeOptimizationProvider {

    private static final String PROVIDER_NAME = "placeholder";

    @Override
    public ResumeOptimizationResult optimize(
            ResumeOptimizationRequest request
    ) {

        Set<String> keyWeaknesses = new LinkedHashSet<>();
        request.getCategoryStatus().forEach((category, status) -> {
            if ("NEEDS_IMPROVEMENT".equals(status)) {
                keyWeaknesses.add(
                        category + " requires stronger evidence."
                );
            }
        });
        addWeaknesses(keyWeaknesses, "Missing skill: ", request.getMissingSkills());
        addWeaknesses(
                keyWeaknesses,
                "Missing project evidence: ",
                request.getMissingProjects()
        );

        Set<String> priorityRecommendations = new LinkedHashSet<>(
                request.getPriorityImprovements()
        );

        List<SectionRecommendation> sectionRecommendations =
                new ArrayList<>();
        addSectionRecommendation(
                sectionRecommendations,
                "SKILLS",
                "Add evidence of proficiency with: ",
                request.getMissingSkills()
        );
        addSectionRecommendation(
                sectionRecommendations,
                "EXPERIENCE",
                "Describe experience involving: ",
                request.getMissingExperience()
        );
        addSectionRecommendation(
                sectionRecommendations,
                "PROJECTS",
                "Add a project demonstrating: ",
                request.getMissingProjects()
        );
        addSectionRecommendation(
                sectionRecommendations,
                "EDUCATION",
                "Clarify education evidence for: ",
                request.getMissingEducation()
        );
        addSectionRecommendation(
                sectionRecommendations,
                "CERTIFICATIONS",
                "Add certification evidence for: ",
                request.getMissingCertifications()
        );

        return ResumeOptimizationResult.builder()
                .overallAssessment(
                        "Placeholder assessment (no external AI provider): "
                                + "the current ATS overall score for "
                                + request.getTargetRole()
                                + " is "
                                + request.getOverallScore()
                                + ". Recommendations are generated "
                                + "deterministically from the fresh ATS analysis."
                )
                .keyWeaknesses(List.copyOf(keyWeaknesses))
                .priorityRecommendations(List.copyOf(priorityRecommendations))
                .sectionRecommendations(List.copyOf(sectionRecommendations))
                .provider(PROVIDER_NAME)
                .build();
    }

    private void addWeaknesses(
            Set<String> weaknesses,
            String prefix,
            List<String> missingItems
    ) {
        missingItems.forEach(item -> weaknesses.add(prefix + item));
    }

    private void addSectionRecommendation(
            List<SectionRecommendation> sections,
            String section,
            String prefix,
            List<String> missingItems
    ) {
        if (missingItems.isEmpty()) {
            return;
        }

        sections.add(SectionRecommendation.builder()
                .section(section)
                .recommendations(missingItems.stream()
                        .map(item -> prefix + item)
                        .toList())
                .build());
    }
}