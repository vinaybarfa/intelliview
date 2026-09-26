package com.vinay.intelliview.job.controller;

import com.vinay.intelliview.common.response.ApiResponse;
import com.vinay.intelliview.job.dto.CreateJobRequest;
import com.vinay.intelliview.job.dto.JobResponse;
import com.vinay.intelliview.job.dto.UpdateJobRequest;
import com.vinay.intelliview.job.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @PostMapping
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @Valid @RequestBody CreateJobRequest request,
            Authentication authentication
    ) {
        JobResponse response = jobService.createJob(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(response, "Job created successfully")
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobResponse>>> getMyJobs(
            Authentication authentication
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                jobService.getMyJobs(authentication.getName()),
                "Jobs fetched successfully"
        ));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<ApiResponse<JobResponse>> getJob(
            @PathVariable Long jobId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                jobService.getJob(authentication.getName(), jobId),
                "Job fetched successfully"
        ));
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable Long jobId,
            @Valid @RequestBody UpdateJobRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                jobService.updateJob(authentication.getName(), jobId, request),
                "Job updated successfully"
        ));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long jobId,
            Authentication authentication
    ) {
        jobService.deleteJob(authentication.getName(), jobId);
        return ResponseEntity.noContent().build();
    }
}