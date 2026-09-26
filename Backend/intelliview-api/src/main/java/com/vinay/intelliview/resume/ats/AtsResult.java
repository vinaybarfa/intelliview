package com.vinay.intelliview.resume.ats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AtsResult {

    @Builder.Default
    private Integer score = 0;

    @Builder.Default
    private List<String> strengths = new ArrayList<>();

    @Builder.Default
    private List<String> improvements = new ArrayList<>();

    @Builder.Default
    private List<String> matchedSkills = new ArrayList<>();

    @Builder.Default
    private List<String> missingSkills = new ArrayList<>();

    @Builder.Default
    private List<String> matchedEducation = new ArrayList<>();

    @Builder.Default
    private List<String> missingEducation = new ArrayList<>();

    @Builder.Default
    private List<String> matchedExperience = new ArrayList<>();

    @Builder.Default
    private List<String> missingExperience = new ArrayList<>();

    @Builder.Default
    private List<String> matchedProjects = new ArrayList<>();

    @Builder.Default
    private List<String> missingProjects = new ArrayList<>();

    @Builder.Default
    private List<String> matchedCertifications = new ArrayList<>();

    @Builder.Default
    private List<String> missingCertifications = new ArrayList<>();

}
