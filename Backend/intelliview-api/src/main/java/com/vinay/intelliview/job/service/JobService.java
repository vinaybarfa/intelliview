package com.vinay.intelliview.job.service;

import com.vinay.intelliview.exception.ResourceNotFoundException;
import com.vinay.intelliview.job.dto.CreateJobRequest;
import com.vinay.intelliview.job.dto.JobResponse;
import com.vinay.intelliview.job.dto.UpdateJobRequest;
import com.vinay.intelliview.job.entity.Job;
import com.vinay.intelliview.job.entity.JobStatus;
import com.vinay.intelliview.job.repository.JobRepository;
import com.vinay.intelliview.user.entity.User;
import com.vinay.intelliview.user.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private static final int MAX_TITLE_LENGTH = 150;
    private static final int MAX_COMPANY_NAME_LENGTH = 150;
    private static final int MAX_DESCRIPTION_LENGTH = 30_000;
    private static final int MAX_LOCATION_LENGTH = 150;
    private static final int MAX_EMPLOYMENT_TYPE_LENGTH = 50;

    private final UserService userService;
    private final JobRepository jobRepository;


    @Transactional
    public JobResponse createJob(String email, @Valid CreateJobRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Job request is required.");
        }

        User user = userService.findByEmail(email);

        Job job = Job.builder()
                .user(user)
                .title(requiredText(request.getTitle(), "Job title", MAX_TITLE_LENGTH))
                .companyName(requiredText(
                        request.getCompanyName(),
                        "Company name",
                        MAX_COMPANY_NAME_LENGTH
                ))
                .description(requiredText(
                        request.getDescription(),
                        "Job description",
                        MAX_DESCRIPTION_LENGTH
                ))
                .location(optionText(request.getLocation(), "Location", MAX_LOCATION_LENGTH))
                .employmentType(optionText(
                        request.getEmploymentType(),
                        "Employment type",
                        MAX_EMPLOYMENT_TYPE_LENGTH
                )).status(request.getStatus() == null ? JobStatus.ACTIVE : request.getStatus())
                .build();

        return toResponse(jobRepository.save(job));
    }

    @Transactional(readOnly = true)
    public List<JobResponse> getMyJobs(String email) {
        User user = userService.findByEmail(email);
        return jobRepository.findAllByUserOrderByCreatedAtDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public JobResponse getJob(String email, Long jobId) {
        return toResponse(findOwnedJob(email, jobId));
    }

    private Job findOwnedJob(String email, Long jobId) {
        if (jobId == null) {
            throw new ResourceNotFoundException("Job not found.");
        }
        User user = userService.findByEmail(email);
        return jobRepository.findByIdAndUser(jobId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found."));
    }

    @Transactional
    public JobResponse updateJob(String email, Long jobId, @Valid UpdateJobRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Job request is required");
        }

        Job job = findOwnedJob(email, jobId);
        job.setTitle(requiredText(request.getTitle(), "Job title", MAX_TITLE_LENGTH));
        job.setCompanyName(
                requiredText(
                        request.getCompanyName(),
                        "Company name",
                        MAX_COMPANY_NAME_LENGTH
                )
        );
        job.setDescription(requiredText(
                request.getDescription(),
                "Job description",
                MAX_DESCRIPTION_LENGTH
        ));
        job.setLocation(optionText(request.getLocation(), "Location", MAX_LOCATION_LENGTH));
        job.setEmploymentType(optionText(
                request.getEmploymentType(),
                "Employment type",
                MAX_DESCRIPTION_LENGTH
        ));

        if (request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }

        return toResponse(jobRepository.save(job));
    }

    @Transactional
    public void deleteJob(String email, Long jobId) {
        jobRepository.delete(findOwnedJob(email, jobId));
    }

    private JobResponse toResponse(Job job) {
        return JobResponse.builder().id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompanyName())
                .description(job.getDescription())
                .location(job.getLocation())
                .employmentType(job.getEmploymentType())
                .status(job.getStatus().name())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .build();
    }

    private String optionText(String value, String field, int maximumLength) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        String normalizedValue = value.trim();
        if (normalizedValue.length() > maximumLength) {
            throw new IllegalArgumentException(field + " is invalid.");
        }

        return normalizedValue;
    }

    private String requiredText(String value, String field, int maximumLength) {
        if (value == null || value.trim().isEmpty()
                || value.trim().length() > maximumLength) {
            throw new IllegalArgumentException(field + " is invalid.");
        }
        return value.trim();
    }
}
