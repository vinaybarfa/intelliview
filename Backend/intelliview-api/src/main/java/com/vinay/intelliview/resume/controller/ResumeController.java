package com.vinay.intelliview.resume.controller;

import com.vinay.intelliview.common.response.ApiResponse;
import com.vinay.intelliview.resume.dto.ResumeResponse;
import com.vinay.intelliview.resume.dto.UploadResumeResponse;
import com.vinay.intelliview.resume.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/upload")
    public UploadResumeResponse uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam("targetRole") String targetRole,
            @RequestParam(value = "jobTitle", required = false) String jobTitle,
            @RequestParam(value = "company", required = false) String company,
            @RequestParam(value = "jobDescription", required = false) String jobDescription,
            Authentication authentication
    ){
        return resumeService.uploadResume(
                file, targetRole, jobTitle, company, jobDescription, authentication.getName()
        );
    }

    @GetMapping
    public ApiResponse<List<ResumeResponse>> getMyResumes(
            Authentication authentication
    ) {
        List<ResumeResponse> resumes = resumeService.getMyResumes(
                authentication.getName()
        );

        return ApiResponse.success(
                resumes, "Resumes fetched successfully"
        );
    }

    @GetMapping("/{resumeId}/analysis")
    public ApiResponse<ResumeResponse.AtsReportResponse> analyzeResume(
            @PathVariable Long resumeId,
            Authentication authentication
    ) {
        ResumeResponse.AtsReportResponse response = resumeService.analyzeResume(
                resumeId, authentication.getName()
        );

        return ApiResponse.success(
                response,
                "Resume analysis generated successfully"
        );
    }

    @DeleteMapping("/{resumeId}")
    public ApiResponse<String> deleteResume(
            @PathVariable Long resumeId,
            Authentication authentication
    ) {
        resumeService.deleteResume(
                resumeId,
                authentication.getName()
        );

        return ApiResponse.success(
                "Resume deleted successfully"
        );
    }
}
