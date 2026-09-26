package com.vinay.intelliview.resume.ats.rule;

import com.vinay.intelliview.resume.ats.AtsResult;
import com.vinay.intelliview.resume.ats.profile.AtsProfile;

public interface AtsRule {

    void evaluate(String resumeText, AtsProfile profile, AtsResult result);

}
