package com.vinay.intelliview.job.repository;

import com.vinay.intelliview.job.entity.Job;
import com.vinay.intelliview.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {
    Optional<Job> findByIdAndUser(Long jobId, User user);

    List<Job> findAllByUserOrderByCreatedAtDesc(User user);
}