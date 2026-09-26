package com.vinay.intelliview.interview.ai;

import java.util.List;

public interface InterviewAIProvider {

    InterviewQuestionGenerationResult generateQuestions(
            InterviewQuestionGenerationRequest request
    );

    InterviewAnswerEvaluationResult evaluateAnswer(
            InterviewAnswerEvaluationRequest request
    );

    record InterviewQuestionGenerationRequest(
            String targetRole,
            Integer questionCount
    ) {

    }

    record InterviewQuestionGenerationResult(List<String> questions) {

    }

    record InterviewAnswerEvaluationRequest(
            String targetRole,
            String question,
            String answer
    ) {

    }


    record InterviewAnswerEvaluationResult(
            Integer technicalScore,
            Integer communicationScore,
            Integer confidenceScore,
            Integer overallScore,
            String feedback
    ) {

    }
}
