package com.vinay.intelliview.resume.repository;

import com.vinay.intelliview.resume.entity.Resume;
import com.vinay.intelliview.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

  List<Resume> findByUser(User user);

  Optional<Resume> findByIdAndUser(Long id, User user);

}