package com.vinay.intelliview.user.controller;

import com.vinay.intelliview.common.response.ApiResponse;
import com.vinay.intelliview.user.dto.UpdateProfileRequest;
import com.vinay.intelliview.user.dto.UserProfileResponse;
import com.vinay.intelliview.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<String> currentUser(Authentication authentication) {
        return ApiResponse.success(
                authentication.getName(),
                "Current authenticated User"
        );
    }

    @GetMapping("/profile")
    public ApiResponse<UserProfileResponse> getProfile(
            Authentication authentication
    ) {
        UserProfileResponse response = userService.getProfile(
                authentication.getName()
        );

        return ApiResponse.success(
                response,
                "Profile fetched successfully"
        );
    }

    @PutMapping("/profile")
    public ApiResponse<UserProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
            ){
            UserProfileResponse response = userService.updateProfile(
                    authentication.getName(),
                    request
            );

            return ApiResponse.success(
                    response,
                    "Profile update successfully"
            );
    }

}
