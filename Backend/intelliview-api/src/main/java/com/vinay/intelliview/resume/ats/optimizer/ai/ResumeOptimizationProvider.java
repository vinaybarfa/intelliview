package com.vinay.intelliview.resume.ats.optimizer.ai;

import com.vinay.intelliview.resume.ats.optimizer.domain.ResumeOptimizationRequest;
import com.vinay.intelliview.resume.ats.optimizer.domain.ResumeOptimizationResult;

public interface ResumeOptimizationProvider {
    ResumeOptimizationResult optimize(ResumeOptimizationRequest request);

}
