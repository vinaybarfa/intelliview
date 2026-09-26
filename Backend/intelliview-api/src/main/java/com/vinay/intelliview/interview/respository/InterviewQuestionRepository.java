package com.vinay.intelliview.interview.respository;

import com.vinay.intelliview.interview.entity.Interview;
import com.vinay.intelliview.interview.entity.InterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {

    List<InterviewQuestion> findByInterviewOrderByQuestionOrderAsc(
            Interview interview
    );
}