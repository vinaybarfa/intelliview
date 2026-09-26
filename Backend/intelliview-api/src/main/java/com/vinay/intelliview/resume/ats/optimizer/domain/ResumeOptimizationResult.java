package com.vinay.intelliview.resume.ats.optimizer.domain;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ResumeOptimizationResult {
    private final String overallAssessment;
    private final List<String> keyWeaknesses;
    private final List<String> priorityRecommendations;
    private final List<SectionRecommendation> sectionRecommendations;
    private final String provider;

}
