package com.vinay.intelliview.interview.respository;

import com.vinay.intelliview.interview.entity.Interview;
import com.vinay.intelliview.interview.entity.InterviewAnswer;
import com.vinay.intelliview.interview.entity.InterviewQuestion;
import com.vinay.intelliview.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    Optional<Interview> findByIdAndUser(Long id, User user);
    List<Interview> findAllByUserOrderByStartedAtDesc(User user);
}