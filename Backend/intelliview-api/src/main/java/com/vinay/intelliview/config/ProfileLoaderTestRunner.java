package com.vinay.intelliview.config;

import com.vinay.intelliview.resume.ats.profile.AtsProfile;
import com.vinay.intelliview.resume.ats.profile.ProfileLoader;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
        name = "intelliview.debug.profile-loader",
        havingValue = "true"
)
@RequiredArgsConstructor
public class ProfileLoaderTestRunner implements CommandLineRunner {

    private final ProfileLoader profileLoader;


    @Override
    public void run(String... args) throws Exception {
        AtsProfile profile =
                profileLoader.load("java-developer");

        System.out.println("========== ATS PROFILE ==========");
        System.out.println("ID: " + profile.getId());
        System.out.println("Name: " + profile.getDisplayName());
        System.out.println("Required Skills: " + profile.getRequiredSkills());
        System.out.println("=================================");
    }
}
