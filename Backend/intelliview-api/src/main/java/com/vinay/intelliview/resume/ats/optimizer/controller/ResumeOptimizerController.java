package com.vinay.intelliview.resume.ats.optimizer.controller;

import com.vinay.intelliview.common.response.ApiResponse;
import com.vinay.intelliview.resume.ats.optimizer.dto.ResumeOptimizationResponse;
import com.vinay.intelliview.resume.ats.optimizer.service.ResumeOptimizerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeOptimizerController {

    private final ResumeOptimizerService resumeOptimizerService;

    @PostMapping("/{resumeId}/optimize")
    public ApiResponse<ResumeOptimizationResponse> optimizeResume(
            @PathVariable Long resumeId,
            Authentication authentication
    ) {
        ResumeOptimizationResponse response =
                resumeOptimizerService.optimizeResume(
                        resumeId,
                        authentication.getName()
                );

        return ApiResponse.success(
                response,
                "Resume optimization generated successfully"
        );
    }
}
