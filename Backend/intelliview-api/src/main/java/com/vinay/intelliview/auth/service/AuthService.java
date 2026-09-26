package com.vinay.intelliview.auth.service;

import com.vinay.intelliview.auth.dto.ChangePasswordRequest;
import com.vinay.intelliview.auth.dto.LoginRequest;
import com.vinay.intelliview.auth.dto.LoginResponse;
import com.vinay.intelliview.auth.dto.RegisterRequest;
import com.vinay.intelliview.common.response.ApiResponse;
import com.vinay.intelliview.exception.DuplicateResourceException;
import com.vinay.intelliview.exception.ResourceNotFoundException;
import com.vinay.intelliview.exception.UnauthorizedException;
import com.vinay.intelliview.security.jwt.JwtService;
import com.vinay.intelliview.user.entity.Role;
import com.vinay.intelliview.user.entity.User;
import com.vinay.intelliview.user.repository.RoleRepository;
import com.vinay.intelliview.user.repository.UserRepository;
import com.vinay.intelliview.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public ApiResponse<String> register(RegisterRequest request) {

        if (userService.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email already exists: " + request.getEmail()
            );
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new ResourceNotFoundException("Default role ROLE_USER not found"));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(userRole)
                .email(request.getEmail())
                .enabled(true)
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);
        return ApiResponse.success("User registered successfully");
    }

    public ApiResponse<LoginResponse> login(LoginRequest request) {

        User user = userService.findByEmail(request.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        LoginResponse loginResponse = LoginResponse.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .token(token)
                .build();
        return ApiResponse.success(loginResponse, "Login successful");
    }

    public ApiResponse<String> changePassword(String email, ChangePasswordRequest request) {

        User user = userService.findByEmail(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userService.save(user);

        return ApiResponse.success("Password changed successfully");


    }
}
