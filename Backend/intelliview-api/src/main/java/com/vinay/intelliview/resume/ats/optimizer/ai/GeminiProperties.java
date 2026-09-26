package com.vinay.intelliview.resume.ats.optimizer.ai;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "intelliview.ai.gemini")
public class GeminiProperties {

    private String apiKey;
    private String model = "gemini-3.5-flash";
    private String baseUrl = "https://generativelanguage.googleapis.com/v1beta";
    private Duration connectTimeout = Duration.ofSeconds(5);
    private Duration requestTimeout = Duration.ofSeconds(60);
}
