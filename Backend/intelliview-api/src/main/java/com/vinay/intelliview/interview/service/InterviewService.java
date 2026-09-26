package com.vinay.intelliview.interview.service;

import com.vinay.intelliview.exception.ResourceNotFoundException;
import com.vinay.intelliview.interview.ai.InterviewAIProvider;
import com.vinay.intelliview.interview.dto.InterviewActionResponse;
import com.vinay.intelliview.interview.dto.InterviewListItemResponse;
import com.vinay.intelliview.interview.dto.InterviewReportResponse;
import com.vinay.intelliview.interview.entity.Interview;
import com.vinay.intelliview.interview.entity.InterviewAnswer;
import com.vinay.intelliview.interview.entity.InterviewQuestion;
import com.vinay.intelliview.interview.entity.InterviewStatus;
import com.vinay.intelliview.interview.respository.InterviewAnswerRepository;
import com.vinay.intelliview.interview.respository.InterviewQuestionRepository;
import com.vinay.intelliview.interview.respository.InterviewRepository;
import com.vinay.intelliview.user.entity.User;
import com.vinay.intelliview.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private static final int MAX_TARGET_ROLE_LENGTH = 100;
    private static final int MIN_QUESTION_COUNT = 1;
    private static final int MAX_QUESTION_COUNT = 20;
    private static final int MAX_ANSWER_TEXT_LENGTH = 10_000;

    private final UserService userService;
    private final InterviewRepository interviewRepository;
    private final InterviewQuestionRepository interviewQuestionRepository;
    private final InterviewAnswerRepository interviewAnswerRepository;
    private final InterviewAIProvider interviewAIProvider;


    @Transactional(readOnly = true)
    public List<InterviewListItemResponse> getUserInterviews(String email) {
        User user = userService.findByEmail(email);
        return interviewRepository.findAllByUserOrderByStartedAtDesc(user)
                .stream()
                .map(this::toListItemResponse)
                .toList();
    }

    private InterviewListItemResponse toListItemResponse(Interview interview) {
        return InterviewListItemResponse.builder()
                .id(interview.getId())
                .targetRole(interview.getTargetRole())
                .status(interview.getStatus().name())
                .totalQuestions(interview.getTotalQuestion())
                .answeredQuestions(interview.getAnsweredQuestions())
                .overallScore(interview.getOverallScore())
                .startedAt(interview.getStartedAt())
                .completedAt(interview.getCompletedAt())
                .build();
    }

    public Interview startInterview(String email, String targetRole, Integer questionCount) {

        User user = userService.findByEmail(email);
        String normalizedTargetRole = validateTargetRole(targetRole);
        validateQuestionCount(questionCount);

        Interview savedInterview = interviewRepository.save(
                Interview.builder()
                        .user(user)
                        .targetRole(normalizedTargetRole)
                        .status(InterviewStatus.IN_PROGRESS)
                        .totalQuestion(questionCount)
                        .answeredQuestions(0)
                        .overallScore(null)
                        .startedAt(LocalDateTime.now())
                        .completedAt(null)
                        .build()
        );

        InterviewAIProvider.InterviewQuestionGenerationResult result = interviewAIProvider.generateQuestions(
                new InterviewAIProvider.InterviewQuestionGenerationRequest(normalizedTargetRole, questionCount)
        );

        List<String> generatedQuestion = validateGeneratedQuestions(result, questionCount);

        List<InterviewQuestion> questions = new ArrayList<>(questionCount);

        for (int index = 0; index < generatedQuestion.size(); index++) {
            questions.add(
                    InterviewQuestion.builder()
                            .interview(savedInterview)
                            .questionOrder(index + 1)
                            .questionText(generatedQuestion.get(index))
                            .questionType("GENERAL")
                            .build()
            );
        }

        List<InterviewQuestion> savedQuestion =
                interviewQuestionRepository.saveAll(questions);
        savedInterview.setTotalQuestion(savedQuestion.size());

        return savedInterview;

    }

    private void validateQuestionCount(Integer questionCount) {
        if (questionCount == null || questionCount < MIN_QUESTION_COUNT) {
            throw new IllegalStateException("Question count must be between 1 and 20.");
        }
    }

    private List<String> validateGeneratedQuestions(InterviewAIProvider.InterviewQuestionGenerationResult result, Integer questionCount) {
        if (result == null || result.questions() == null
                || result.questions().isEmpty()
                || result.questions().size() != questionCount
                || result.questions().stream().anyMatch(
                question -> question == null || question.isBlank()
        )) {
            throw new IllegalStateException(
                    "Interview AI provider returned invalid questions."
            );
        }

        return result.questions();
    }

    private String validateTargetRole(String targetRole) {
        if (targetRole == null) {
            throw new IllegalArgumentException("Target role is required");
        }
        String normalizedTargetRole = targetRole.trim();
        if (normalizedTargetRole.isEmpty() || normalizedTargetRole.length() > MAX_TARGET_ROLE_LENGTH) {
            throw new IllegalStateException("Target role is invalid.");
        }
        return normalizedTargetRole;
    }

    @Transactional
    public InterviewActionResponse submitAnswer(
            String email,
            Long interviewId,
            Long questionId,
            String answerText
    ) {
        User user = userService.findByEmail(email);
        Interview interview = interviewRepository.findByIdAndUser(
                        interviewId,
                        user
                )
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Interview not found."
                ));
        if (interview.getStatus() != InterviewStatus.IN_PROGRESS) {
            throw new IllegalStateException("Interview is not in progress.");
        }

        String normalizedAnswerText = validateAnswerText(answerText);
        InterviewQuestion question = interviewQuestionRepository.findById(
                        questionId
                )
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Interview question not found."
                ));
        if (!question.getInterview().getId().equals(interview.getId())) {
            throw new ResourceNotFoundException("Interview question not found.");
        }
        if (question.getQuestionOrder()
                != interview.getAnsweredQuestions() + 1) {
            throw new IllegalStateException(
                    "Question must be answered in sequence."
            );
        }
        if (interviewAnswerRepository.findByQuestion(question).isPresent()) {
            throw new IllegalStateException("Question has already been answered.");
        }

        InterviewAIProvider.InterviewAnswerEvaluationResult evaluation =
                interviewAIProvider.evaluateAnswer(
                        new InterviewAIProvider.InterviewAnswerEvaluationRequest(
                                interview.getTargetRole(),
                                question.getQuestionText(),
                                normalizedAnswerText
                        )
                );
        validateEvaluation(evaluation);

        InterviewAnswer savedAnswer = interviewAnswerRepository.save(
                InterviewAnswer.builder()
                        .question(question)
                        .answerText(normalizedAnswerText)
                        .technicalScore(evaluation.technicalScore())
                        .communicationScore(evaluation.communicationScore())
                        .confidenceScore(evaluation.confidenceScore())
                        .overallScore(evaluation.overallScore())
                        .aiFeedback(evaluation.feedback().trim())
                        .build()
        );
        interview.setAnsweredQuestions(interview.getAnsweredQuestions() + 1);

        return InterviewActionResponse.builder()
                .interviewId(interview.getId())
                .status(interview.getStatus().name())
                .answeredQuestions(interview.getAnsweredQuestions())
                .totalQuestions(interview.getTotalQuestion())
                .overallScore(interview.getOverallScore())
                .build();
    }



    private void validateEvaluation(InterviewAIProvider.InterviewAnswerEvaluationResult evaluation) {
        if (evaluation == null
                || !isScoreValid(evaluation.technicalScore())
                || !isScoreValid(evaluation.communicationScore())
                || !isScoreValid(evaluation.confidenceScore())
                || !isScoreValid(evaluation.overallScore())
                || evaluation.feedback() == null
                || evaluation.feedback().isBlank()) {
            throw new IllegalStateException(
                    "Interview AI provider returned invalid evaluation."
            );
        }
    }

        private boolean isScoreValid(Integer score) {
            return score != null && score >= 0 && score <= 100;
        }

    private String validateAnswerText(String answerText) {
        if (answerText == null) {
            throw new IllegalStateException("Answer text is invalid.");
        }
        String normalizedAnswerText = answerText.trim();

        if (normalizedAnswerText.isEmpty()
                || normalizedAnswerText.length() > MAX_ANSWER_TEXT_LENGTH) {
            throw new IllegalArgumentException("Answer text is invalid.");
        }
        return normalizedAnswerText;
    }

    public Interview completeInterview(String email, Long interviewId) {

        User user = userService.findByEmail(email);

        Interview interview = interviewRepository.findByIdAndUser(
                interviewId,
                user
        ).orElseThrow(() -> new ResourceNotFoundException(
                "Interview not found."
        ));

        if (interview.getStatus() != InterviewStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Interview is not in progress");
        }

        if (!interview.getAnsweredQuestions().equals(interview.getTotalQuestion())) {
            throw new IllegalStateException(
                    "All interview question must be answered before completion."
            );
        }

        List<InterviewQuestion> questions = interviewQuestionRepository.findByInterviewOrderByQuestionOrderAsc(interview);

        if (questions.size() != interview.getTotalQuestion()) {
            throw new IllegalStateException("Interview question data is inconsistent");
        }

        long totalScore = 0;

        for (InterviewQuestion question : questions) {
            InterviewAnswer answer = interviewAnswerRepository
                    .findByQuestion(question).orElseThrow(
                            () -> new IllegalStateException(
                                    "Interview answer data is incomplete"
                            )
                    );

            if (answer.getOverallScore() == null) {
                throw new IllegalStateException(
                        "Interview answer data is incomplete."
                );
            }
            totalScore += answer.getOverallScore();
        }

        int finalScore = (int) Math.round(
                (double) totalScore / questions.size()
        );

        interview.setOverallScore(finalScore);
        interview.setStatus(InterviewStatus.COMPLETED);
        interview.setCompletedAt(LocalDateTime.now());

        return interviewRepository.save(interview);
    }

    @Transactional(readOnly = true)
    public InterviewReportResponse getInterviewReport(String email, Long interviewId) {

        User user = userService.findByEmail(email);
        Interview interview = interviewRepository.findByIdAndUser(interviewId, user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Interview not found"
                ));

        if (interview.getStatus() != InterviewStatus.COMPLETED) {
            throw new IllegalStateException("Interview is not completed.");
        }

        List<InterviewAnswer> answers = interviewAnswerRepository
                .findAllByInterviewWithQuestionOrderByQuestionOrderAsc(interview);

        if (answers.size() != interview.getTotalQuestion()) {
            throw new IllegalStateException("Interview answer data is incomplete.");
        }

        List<InterviewReportResponse.QuestionReport> questionReports =
                new ArrayList<>(answers.size());

        for (InterviewAnswer answer : answers) {
            InterviewQuestion question = answer.getQuestion();

            questionReports.add(
                    InterviewReportResponse.QuestionReport
                            .builder()
                            .questionId(question.getId())
                            .questionOrder(question.getQuestionOrder())
                            .questionText(question.getQuestionText())
                            .questionType(question.getQuestionType())
                            .answerText(answer.getAnswerText())
                            .technicalScore(answer.getTechnicalScore())
                            .communicationScore(answer.getCommunicationScore())
                            .confidenceScore(answer.getConfidenceScore())
                            .overallScore(answer.getOverallScore())
                            .aiFeedback(answer.getAiFeedback())
                            .build());

        }

        return InterviewReportResponse
                .builder()
                .interviewId(interview.getId())
                .status(interview.getStatus().name())
                .totalQuestions(interview.getTotalQuestion())
                .answeredQuestion(interview.getAnsweredQuestions())
                .overallScore(interview.getOverallScore())
                .startedAt(interview.getStartedAt())
                .completeAt(interview.getCompletedAt())
                .questions(questionReports)
                .build();
    }
}
