package com.vinay.intelliview.interview.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.lang.model.type.IntersectionType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StartInterviewRequest {

    @NotBlank(message = "Target role is required.")
    @Size(max = 100, message = "Target role must not exceed 100 characters.")
    private String targetRole;

    @NotNull(message = "Question count is required")
    @Min(value = 1, message = "Question count must be between 1 to 20.")
    @Max(value = 20, message = "Question count must be between 1 and 20.")
    private Integer questionCount;
}
