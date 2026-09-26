package com.vinay.intelliview.interview.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewActionResponse {

    private Long interviewId;
    private String status;
    private Integer answeredQuestions;
    private Integer totalQuestions;
    private Integer overallScore;

}