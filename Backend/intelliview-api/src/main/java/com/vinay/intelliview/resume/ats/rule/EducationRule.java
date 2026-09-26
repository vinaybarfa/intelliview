package com.vinay.intelliview.resume.ats.rule;

import com.vinay.intelliview.resume.ats.AtsResult;
import com.vinay.intelliview.resume.ats.profile.AtsProfile;
import org.hibernate.validator.internal.engine.tracking.PredefinedScopeProcessedBeansTrackingStrategy;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

@Component
public class EducationRule implements AtsRule{
    @Override
    public void evaluate(String resumeText, AtsProfile profile, AtsResult result) {
        if (resumeText == null || profile == null) {
            return;
        }

        List<String> educationKeywords = profile.getEducationKeywords();
        if (educationKeywords == null || educationKeywords.isEmpty()) {
            return;
        }

        String lowerCaseResumeText = resumeText.toLowerCase();
        List<String> matched = educationKeywords.stream()
                .filter(keyword -> Pattern.compile("\\b" + Pattern.quote(keyword.toLowerCase()) + "\\b")
                        .matcher(lowerCaseResumeText).find())
                .toList();

        if (!matched.isEmpty()) {
            result.setScore(result.getScore() + AtsScoringConfig.EDUCATION_SCORE);
            result.getStrengths().add("Eduction matched target role.");
            result.getMatchedEducation().addAll(matched);
            result.getMissingEducation().addAll(
                    educationKeywords.stream()
                            .filter(keyword -> !matched.contains(keyword))
                            .toList()
            );
        }else{
            result.getImprovements().add("Education does not match the target role.");
            result.getMissingEducation().addAll(educationKeywords);
        }
    }
}
