package com.vinay.intelliview.job.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class JobMatchResponse {

    private Long jobId;
    private String jobTitle;
    private String companyName;

    private Long resumeId;
    private String resumeTargetRole;

    private double matchScore;

    private List<String> matchedKeywords;
    private List<String> missingKeywords;
}