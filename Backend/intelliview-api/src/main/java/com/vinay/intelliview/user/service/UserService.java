package com.vinay.intelliview.user.service;

import com.vinay.intelliview.exception.ResourceNotFoundException;
import com.vinay.intelliview.user.dto.UpdateProfileRequest;
import com.vinay.intelliview.user.dto.UserProfileResponse;
import com.vinay.intelliview.user.entity.User;
import com.vinay.intelliview.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with email: " + email
                        ));
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + id
                        ));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public UserProfileResponse getProfile(String email) {

        User user = findByEmail(email);

        return mapToProfileResponse(user);
    }

    public UserProfileResponse updateProfile(
            String email,
            UpdateProfileRequest request
    ) {

        User user = findByEmail(email);

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User updatedUser = userRepository.save(user);

        return mapToProfileResponse(updatedUser);
    }

    private UserProfileResponse mapToProfileResponse(User user) {

        return UserProfileResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().getName())
                .createdAt(user.getCreatedAt())
                .build();
    }
}