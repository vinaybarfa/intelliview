package com.vinay.intelliview.resume.ats.optimizer.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ResumeOptimizationResponse {

    private final Long resumeId;
    private final String targetRole;
    private final String overallAssessment;
    private final List<String> keyWeaknesses;
    private final List<String> priorityRecommendations;
    private final List<SectionRecommendationResponse> sectionRecommendations;
    private final String provider;
}
