package com.vinay.intelliview.job.controller;

import com.vinay.intelliview.common.response.ApiResponse;
import com.vinay.intelliview.job.dto.JobMatchResponse;
import com.vinay.intelliview.job.service.JobMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class JobMatchController {

    private final JobMatchService jobMatchService;

    @GetMapping("/job-matches")
    public ResponseEntity<ApiResponse<List<JobMatchResponse>>> getJobMatches(
            Authentication authentication
    ) {

        List<JobMatchResponse> matches =
                jobMatchService.getJobMatches(authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.success(matches)
        );
    }

    @PostMapping("/jobs/{jobId}/match")
    public ResponseEntity<ApiResponse<JobMatchResponse>> matchJob(
            @PathVariable Long jobId,
            @RequestBody Map<String, Long> request,
            Authentication authentication
    ) {

        Long resumeId = request.get("resumeId");

        if (resumeId == null) {
            throw new IllegalArgumentException("resumeId is required");
        }

        JobMatchResponse result =
                jobMatchService.matchJob(
                        authentication.getName(),
                        jobId,
                        resumeId
                );

        return ResponseEntity.ok(
                ApiResponse.success(result)
        );
    }
}