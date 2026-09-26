package com.vinay.intelliview.resume.ats.rule;

import com.vinay.intelliview.resume.ats.AtsResult;
import com.vinay.intelliview.resume.ats.profile.AtsProfile;
import org.springframework.stereotype.Component;

@Component
public class EmailRule implements AtsRule{


    @Override
    public void evaluate(String resumeText, AtsProfile profile, AtsResult result) {
        if (resumeText == null) {
            result.getImprovements().add("Email address is missing.");
            return;
        }

        if (resumeText.matches("(?s).*\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}\\b.*")) {

            result.setScore(result.getScore() + 10);
            result.getStrengths().add("Professional email address found.");

        } else {

            result.getImprovements().add("Email address is missing.");
        }
    }
}
