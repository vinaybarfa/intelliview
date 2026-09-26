package com.vinay.intelliview.resume.ats;

import com.vinay.intelliview.resume.ats.profile.AtsProfile;
import com.vinay.intelliview.resume.ats.rule.AtsRule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DefaultAtsEngine implements AtsEngine{

    private final List<AtsRule> rules;

    @Override
    public AtsResult analyze(String resumeText, AtsProfile profile) {

        AtsResult result = AtsResult.builder()
                .score(0)
                .strengths(new ArrayList<>())
                .improvements(new ArrayList<>())
                .build();

        for (AtsRule rule : rules) {
            rule.evaluate(resumeText, profile, result);
        }
        return result;

    }


}
