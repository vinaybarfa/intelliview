package com.vinay.intelliview.resume.ats.profile;

import com.vinay.intelliview.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;

@Component
@RequiredArgsConstructor
public class JsonProfileLoader implements ProfileLoader{

    private final ObjectMapper objectMapper;

    @Override
    public AtsProfile load(String profileId) {
        final String path = String.format("ats/profiles/%s.json", profileId);
        final ClassPathResource resource = new ClassPathResource(path);

        if (!resource.exists()) {
            throw new ResourceNotFoundException("ATS profile not found with id: "+profileId);
        }

        try (InputStream inputStream = resource.getInputStream()){
            return objectMapper.readValue(inputStream, AtsProfile.class);
        }catch (IOException e) {
            throw new RuntimeException("Failed to load or parse ATS profile with id: "+profileId, e);
        }
    }
}
