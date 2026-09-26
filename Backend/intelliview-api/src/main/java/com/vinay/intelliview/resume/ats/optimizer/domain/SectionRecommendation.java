package com.vinay.intelliview.resume.ats.optimizer.domain;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SectionRecommendation {

    private final String section;
    private final List<String> recommendations;
}