package com.vinay.intelliview.resume.ats.optimizer.domain;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Getter
@Builder
public class ResumeOptimizationRequest {
    private final String resumeText;
    private final String targetRole;
    private final int overallScore;
    private final Map<String, Integer> categoryScores;
    private final Map<String, String> categoryStatus;
    private final List<String> strengths;
    private final List<String> improvements;
    private final List<String> priorityImprovements;
    private final List<String> matchedSkills;
    private final List<String> missingSkills;
    private final List<String> matchedEducation;
    private final List<String> missingEducation;
    private final List<String> matchedExperience;
    private final List<String> missingExperience;
    private final List<String> matchedProjects;
    private final List<String> missingProjects;
    private final List<String> matchedCertifications;
    private final List<String> missingCertifications;

}
