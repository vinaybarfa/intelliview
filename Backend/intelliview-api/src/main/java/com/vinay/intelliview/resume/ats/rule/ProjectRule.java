package com.vinay.intelliview.resume.ats.rule;

import com.vinay.intelliview.resume.ats.AtsResult;
import com.vinay.intelliview.resume.ats.profile.AtsProfile;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

@Component
public class ProjectRule implements AtsRule{

    @Override
    public void evaluate(String resumeText, AtsProfile profile, AtsResult result) {
        if (resumeText == null || profile == null) {
            return;
        }

        List<String> projectKeywords = profile.getProjectKeywords();

        if (projectKeywords == null || projectKeywords.isEmpty()) {
            return;
        }

        String lowerCaseResumeText = resumeText.toLowerCase();

        List<String> matched = projectKeywords.stream()
                .filter(keyword -> Pattern.compile("\\b" + Pattern.quote(keyword.toLowerCase()) + "\\b").matcher(lowerCaseResumeText).find())
                .toList();
        if (!matched.isEmpty()) {
            result.setScore(result.getScore() + AtsScoringConfig.PROJECT_SCORE);
            result.getStrengths().add("Relevant projects detected.");
            result.getMatchedProjects().addAll(matched);
            result.getMissingProjects().addAll(
                    projectKeywords.stream()
                            .filter(keyword -> !matched.contains(keyword))
                            .toList()
            );
        }else {
            result.getImprovements().add("Relevant projects are missing.");
            result.getMissingProjects().addAll(projectKeywords);
        }
    }
}
