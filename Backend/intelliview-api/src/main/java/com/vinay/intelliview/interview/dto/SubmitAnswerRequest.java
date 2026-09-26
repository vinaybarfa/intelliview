package com.vinay.intelliview.interview.dto;

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
public class SubmitAnswerRequest {

    @NotBlank(message = "Answer text is required")
    @Size(max = 10_000, message = "Answer text must not exceed 10000 charaters.")
    private String answerText;
}
