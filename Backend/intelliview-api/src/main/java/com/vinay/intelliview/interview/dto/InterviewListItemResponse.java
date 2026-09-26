package com.vinay.intelliview.interview.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewListItemResponse {

    private Long id;
    private String targetRole;
    private String status;
    private Integer totalQuestions;
    private Integer answeredQuestions;
    private Integer overallScore;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

}