package com.vinay.intelliview.resume.ats.rule;

import com.vinay.intelliview.resume.ats.AtsResult;
import com.vinay.intelliview.resume.ats.profile.AtsProfile;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

@Component
public class SkillsRule implements AtsRule {

    @Override
    public void evaluate(String resumeText, AtsProfile profile, AtsResult result) {
        if (resumeText == null || profile == null) {
            return;
        }
        List<String> requiredSkills =
                profile.getRequiredSkills();

        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return;
        }

        String lowerCaseResumeText = resumeText.toLowerCase();

        for (String skill : requiredSkills) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(skill.toLowerCase()) + "\\b");
            if (pattern.matcher(lowerCaseResumeText).find()) {
                result.setScore(result.getScore() + AtsScoringConfig.SKILL_SCORE);
                result.getStrengths().add("Found required skill: " + skill);
                result.getMatchedSkills().add(skill);
            } else {
                result.getImprovements().add("Missing required skill: " + skill);
                result.getMatchedSkills().add(skill);
            }
        }

    }
}
