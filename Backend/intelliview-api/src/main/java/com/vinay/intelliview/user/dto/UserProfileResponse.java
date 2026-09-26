package com.vinay.intelliview.user.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {


    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String role;

    private LocalDateTime createdAt;

}
