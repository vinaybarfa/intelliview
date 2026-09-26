package com.vinay.intelliview.job.dto;

import com.vinay.intelliview.job.entity.JobStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateJobRequest {

    @NotBlank(message = "Job title is required.")
    @Size(max = 150, message = "Job title must not exceed 150 characters.")
    private String title;

    @NotBlank(message = "Company name is required.")
    @Size(max = 150, message = "Company name must not exceed 150 characters.")
    private String companyName;

    @NotBlank(message = "Job description is required.")
    @Size(max = 30_000, message = "Job description must not exceed 30000 characters.")
    private String description;

    @Size(max = 150, message = "Location must not exceed 150 characters.")
    private String location;

    @Size(max = 50, message = "Employment type must not exceed 50 characters.")
    private String employmentType;

    private JobStatus status;
}