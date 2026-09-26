package com.vinay.intelliview.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginResponse {

    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String token;

}
