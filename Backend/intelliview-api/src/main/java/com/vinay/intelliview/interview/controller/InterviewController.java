package com.vinay.intelliview.interview.controller;

import com.vinay.intelliview.common.response.ApiResponse;
import com.vinay.intelliview.interview.dto.*;
import com.vinay.intelliview.interview.entity.Interview;
import com.vinay.intelliview.interview.entity.InterviewQuestion;
import com.vinay.intelliview.interview.respository.InterviewQuestionRepository;
import com.vinay.intelliview.interview.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final InterviewQuestionRepository interviewQuestionRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InterviewListItemResponse>>> getInterviews(          // we fetch the interview
            Authentication authentication
    ) {
        List<InterviewListItemResponse> interviews =
                interviewService.getUserInterviews(authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.success(interviews, "interviews fetched successfully")
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StartInterviewResponse>> startInterview(               // start the interview
            @Valid @RequestBody StartInterviewRequest request,
            Authentication authentication
    ) {
        Interview interview = interviewService.startInterview(
                authentication.getName(),
                request.getTargetRole(),
                request.getQuestionCount()
        );
        List<InterviewQuestionResponse> questions = interviewQuestionRepository
                .findByInterviewOrderByQuestionOrderAsc(interview)
                .stream()
                .map(this::toQuestionResponse)
                .toList();

        StartInterviewResponse response = StartInterviewResponse.builder()
                .interviewId(interview.getId())
                .targetRole(interview.getTargetRole())
                .status(interview.getStatus().name())
                .totalQuestions(interview.getTotalQuestion())
                .answeredQuestions(interview.getAnsweredQuestions())
                .startedAt(interview.getStartedAt())
                .questions(questions)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(response, "Interview started successfully")
        );
    }

    @PostMapping("/{interviewId}/questions/{questionId}/answer")
    public ResponseEntity<ApiResponse<InterviewActionResponse>> submitAnswer(               /// submit the answer
            @PathVariable Long interviewId,
            @PathVariable Long questionId,
            @Valid @RequestBody SubmitAnswerRequest request,
            Authentication authentication
    ) {
        InterviewActionResponse response = interviewService.submitAnswer(
                authentication.getName(),
                interviewId,
                questionId,
                request.getAnswerText()
        );

        return ResponseEntity.ok(
                ApiResponse.success(response, "Answer submitted successfully")
        );
    }


    @PostMapping("/{interviewId}/complete")
    public ResponseEntity<ApiResponse<InterviewActionResponse>> completeInterview(            ///  complete the interview
            @PathVariable Long interviewId,
            Authentication authentication
    ) {
        Interview interview = interviewService.completeInterview(authentication.getName(), interviewId);

        InterviewActionResponse response = InterviewActionResponse.builder()
                .interviewId(interview.getId())
                .status(interview.getStatus().name())
                .answeredQuestions(interview.getAnsweredQuestions())
                .totalQuestions(interview.getTotalQuestion())
                .overallScore(interview.getOverallScore())
                .build();

        return ResponseEntity.ok(
                ApiResponse.success(response, "Interview completed successfully")
        );
    }


    @GetMapping("/{interviewId}/report")
    public ResponseEntity<ApiResponse<InterviewReportResponse>> getInterviewReport(
            @PathVariable Long interviewId,
            Authentication authentication
    ) {
        InterviewReportResponse response = interviewService.getInterviewReport(
                authentication.getName(),
                interviewId
        );

        return ResponseEntity.ok(
                ApiResponse.success(response, "Interview report fetched successfully")
        );
    }

    private InterviewQuestionResponse toQuestionResponse(
            InterviewQuestion question
    ) {
        return InterviewQuestionResponse.builder()
                .questionId(question.getId())
                .questionOrder(question.getQuestionOrder())
                .questionText(question.getQuestionText())
                .questionType(question.getQuestionType())
                .build();
    }
}