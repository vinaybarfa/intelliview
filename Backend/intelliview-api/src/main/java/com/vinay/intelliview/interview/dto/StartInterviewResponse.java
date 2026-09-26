package com.vinay.intelliview.interview.dto;

import com.vinay.intelliview.interview.entity.Interview;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartInterviewResponse {

    private Long interviewId;
    private String targetRole;
    private String status;
    private Integer totalQuestions;
    private Integer answeredQuestions;
    private LocalDateTime startedAt;
    private List<InterviewQuestionResponse> questions;

}





