package com.vinay.intelliview.interview.respository;

import com.vinay.intelliview.interview.entity.Interview;
import com.vinay.intelliview.interview.entity.InterviewAnswer;
import com.vinay.intelliview.interview.entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InterviewAnswerRepository extends JpaRepository<InterviewAnswer, Long> {

    Optional<InterviewAnswer> findByIdAndQuestion(
            Long id,
            InterviewQuestion question
    );

    @Query("""
            select answer from InterviewAnswer answer
            join fetch answer.question question
            where question.interview = :interview
            order by question.questionOrder asc
            """)
    List<InterviewAnswer> findAllByInterviewWithQuestionOrderByQuestionOrderAsc(
            @Param("interview") Interview interview
    );

    Optional<InterviewAnswer> findByQuestion(InterviewQuestion question);}