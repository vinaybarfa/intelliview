package com.vinay.intelliview.interview.dto;

import com.vinay.intelliview.interview.entity.InterviewStatus;
import com.vinay.intelliview.interview.respository.InterviewQuestionRepository;
import lombok.*;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewReportResponse {

    private Long interviewId;
    private String targetRole;
    private String status;
    private Integer totalQuestions;
    private Integer answeredQuestion;
    private Integer overallScore;
    private LocalDateTime startedAt;
    private LocalDateTime completeAt;
    private List<QuestionReport> questions;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class QuestionReport {

        private Long questionId;
        private Integer questionOrder;
        private String questionText;
        private String questionType;
        private String answerText;
        private Integer technicalScore;
        private Integer communicationScore;
        private Integer confidenceScore;
        private Integer overallScore;
        private String aiFeedback;

    }
}
