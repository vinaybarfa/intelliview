package com.vinay.intelliview.resume.ats.rule;

import com.vinay.intelliview.resume.ats.AtsResult;
import com.vinay.intelliview.resume.ats.profile.AtsProfile;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
public class ExperienceRule implements AtsRule {

    private static final int EXPERIENCE_MATCH_SCORE = 10;

    @Override
    public void evaluate(String resumeText, AtsProfile profile, AtsResult result) {
        if (resumeText == null || profile == null) {
            return;
        }

        List<String> experienceKeywords = profile.getExperienceKeywords();
        if (experienceKeywords == null || experienceKeywords.isEmpty()) {
            return;
        }

        String lowerCaseResumeText = resumeText.toLowerCase();

        List<String> matched = experienceKeywords.stream()
                .filter(keyword -> Pattern.compile("\\b" + Pattern.quote(keyword.toLowerCase()) + "\\b").matcher(lowerCaseResumeText).find())
                .toList();

        if (!matched.isEmpty()) {
            result.setScore(result.getScore() + EXPERIENCE_MATCH_SCORE);
            result.getStrengths().add("Relevant experience found.");
            result.getMatchedExperience().addAll(matched);
            result.getMissingExperience().addAll(
                    experienceKeywords.stream()
                            .filter(keyword -> !matched.contains(keyword))
                            .toList()
            );
        } else {
            result.getImprovements().add("Relevant work experience is missing.");
            result.getMissingExperience().addAll(experienceKeywords);
        }
    }


}
