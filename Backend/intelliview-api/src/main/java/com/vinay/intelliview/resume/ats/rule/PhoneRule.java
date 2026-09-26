package com.vinay.intelliview.resume.ats.rule;

import com.vinay.intelliview.resume.ats.AtsResult;
import com.vinay.intelliview.resume.ats.profile.AtsProfile;
import org.springframework.stereotype.Component;

@Component
public class PhoneRule implements AtsRule {

    @Override
    public void evaluate(String resumeText, AtsProfile profile, AtsResult result) {
        if (resumeText == null) {
            result.getImprovements().add("Phone number is missing.");
            return;
        }

        if (resumeText.matches("(?s).*(\\+?\\d[\\d\\s\\-()]{8,}\\d).*")) {

            result.setScore(result.getScore() + 10);
            result.getStrengths().add("Phone number found.");

        } else {

            result.getImprovements().add("Phone number is missing.");
        }
    }
}
