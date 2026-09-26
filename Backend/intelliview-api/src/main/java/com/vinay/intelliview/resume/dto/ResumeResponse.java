package com.vinay.intelliview.resume.dto;

import com.vinay.intelliview.resume.entity.ResumeStatus;
import lombok.*;
import org.apache.catalina.LifecycleState;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeResponse {

    private Long id;
    private String originalFileName;
    private String targetRole;
    private String jobTitle;
    private String company;
    private String fileType;
    private Long fileSize;
    private ResumeStatus status;
    private Integer atsScore;
    private boolean aiProcessed;
    private LocalDateTime createdAt;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AtsReportResponse {

        private Long resumeId;
        private String targetRole;
        private String jobTitle;
        private String company;
        private Integer overallScore;
        private Map<String, Integer> categoryScores;
        private Map<String, String> categoryStatus;
        private String summary;
        private List<String> priorityImprovements;
        private List<String> strengths;
        private List<String> improvements;
        private List<String> matchedSkills;
        private List<String> missingSkills;
        private List<String> matchedEducation;
        private List<String> missingEducation;
        private List<String> matchedExperience;
        private List<String> missingExperience;
        private List<String> matchedProjects;
        private List<String> missingProjects;
        private List<String> matchedCertifications;
        private List<String> missingCertifications;
    }
}
