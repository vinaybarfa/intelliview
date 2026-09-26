package com.vinay.intelliview.resume.ats;

import com.vinay.intelliview.resume.ats.profile.AtsProfile;

public interface AtsEngine {

    AtsResult analyze(String resumeText, AtsProfile profile);
}
