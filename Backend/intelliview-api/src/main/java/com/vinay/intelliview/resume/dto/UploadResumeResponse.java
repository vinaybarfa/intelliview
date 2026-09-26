package com.vinay.intelliview.resume.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadResumeResponse {

    private Long id;
    private String originalFileName;
    private String targetRole;
    private String jobTitle;
    private String company;
    private Integer atsScore;
    private String message;

}
