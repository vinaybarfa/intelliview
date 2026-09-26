package com.vinay.intelliview.job.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private Long id;
    private String title;
    private String companyName;
    private String description;
    private String location;
    private String employmentType;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}