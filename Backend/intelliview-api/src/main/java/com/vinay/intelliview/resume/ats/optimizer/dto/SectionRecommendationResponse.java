package com.vinay.intelliview.resume.ats.optimizer.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class SectionRecommendationResponse {

    public final String section;
    private final List<String> recommendations;

}
