package com.vinay.intelliview.auth.controller;

import com.vinay.intelliview.auth.dto.ChangePasswordRequest;
import com.vinay.intelliview.auth.dto.LoginRequest;
import com.vinay.intelliview.auth.dto.LoginResponse;
import com.vinay.intelliview.auth.dto.RegisterRequest;
import com.vinay.intelliview.auth.service.AuthService;
import com.vinay.intelliview.common.response.ApiResponse;
import com.vinay.intelliview.exception.UnauthorizedException;
import com.vinay.intelliview.security.userdetails.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ApiResponse<String> register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/change-password")
    public ApiResponse<String> changePassword(@Valid @RequestBody ChangePasswordRequest request, Authentication authentication) {
        return authService.changePassword(authenticatedEmail(authentication), request);
    }

    private String authenticatedEmail(Authentication authentication) {
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new UnauthorizedException("Authentication is required.");
        }
        return userDetails.getUsername();
    }
}
