package com.vinay.intelliview.resume.ats.profile;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AtsProfile {

    private String id;

    private String displayName;

    private String description;

    private List<String> requiredSkills;

    private List<String> optionalSkills;

    private List<String> frameworks;

    private List<String> libraries;

    private List<String> tools;

    private List<String> databases;

    private List<String> cloudPlatforms;

    private List<String> programmingLanguages;

    private List<String> softSkills;

    private List<String> requiredSections;

    private List<String> preferredSections;

    private List<String> educationKeywords;

    private List<String> experienceKeywords;

    private List<String> projectKeywords;

    private List<String> certificationKeywords;

    private List<String> atsKeywords;

    private Integer minimumScore;

}