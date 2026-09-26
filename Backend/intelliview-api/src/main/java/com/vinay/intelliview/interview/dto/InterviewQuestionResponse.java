package com.vinay.intelliview.interview.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InterviewQuestionResponse {
    private Long questionId;
    private Integer questionOrder;
    private String questionText;
    private String questionType;

}
