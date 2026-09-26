package com.vinay.intelliview.resume.ats.optimizer.ai;

import com.fasterxml.jackson.core.JsonProcessingException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ArrayNode;
import tools.jackson.databind.node.ObjectNode;

import com.vinay.intelliview.resume.ats.optimizer.domain.ResumeOptimizationRequest;
import com.vinay.intelliview.resume.ats.optimizer.domain.ResumeOptimizationResult;
import com.vinay.intelliview.resume.ats.optimizer.domain.SectionRecommendation;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.net.http.HttpClient;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
        prefix = "intelliview.ai",
        name = "provider",
        havingValue = "gemini"
)
public class GeminiResumeOptimizationProvider
        implements ResumeOptimizationProvider {

    private static final String PROVIDER_NAME = "gemini";
    private static final String INTERACTIONS_PATH = "/interactions";
    private static final int MAX_LOGGED_RESPONSE_BODY_LENGTH = 4_096;
    private static final Pattern GOOGLE_API_KEY_PATTERN = Pattern.compile(
            "AIza[0-9A-Za-z_-]+"
    );
    private static final Pattern BEARER_TOKEN_PATTERN = Pattern.compile(
            "(?i)(Bearer\\s+)[^\\s\",}]+"
    );
    private static final Pattern QUERY_API_KEY_PATTERN = Pattern.compile(
            "(?i)([?&](?:key|api_key)=)[^&\\s\"]+"
    );
    private static final Logger log = LoggerFactory.getLogger(
            GeminiResumeOptimizationProvider.class
    );

    private final GeminiProperties properties;
    private final ObjectMapper objectMapper;
    private final RestClient.Builder restClientBuilder;

    @Override
    public com.vinay.intelliview.resume.ats.optimizer.domain.ResumeOptimizationResult optimize(
            ResumeOptimizationRequest request
    ) {
        if (!StringUtils.hasText(properties.getApiKey())) {
            throw new ResumeOptimizationProviderException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini AI provider is not configured."
            );
        }

        try {
            JsonNode response = restClient().post()
                    .uri(INTERACTIONS_PATH)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("x-goog-api-key", properties.getApiKey())
                    .body(buildGeminiRequest(request))
                    .retrieve()
                    .body(JsonNode.class);

            return parseResult(response);
        } catch (ResumeOptimizationProviderException ex) {
            throw ex;
        } catch (RestClientResponseException ex) {
            logGeminiFailure(ex);
            throw new ResumeOptimizationProviderException(
                    HttpStatus.BAD_GATEWAY,
                    "Gemini AI provider returned an unsuccessful response."
            );
        } catch (ResourceAccessException ex) {
            throw new ResumeOptimizationProviderException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini AI provider is temporarily unavailable."
            );
        } catch (RuntimeException ex) {
            throw new ResumeOptimizationProviderException(
                    HttpStatus.BAD_GATEWAY,
                    "Gemini AI provider returned an invalid response."
            );
        }
    }

    private RestClient restClient() {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(properties.getConnectTimeout())
                .build();
        JdkClientHttpRequestFactory requestFactory =
                new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(properties.getRequestTimeout());

        return restClientBuilder.clone()
                .baseUrl(properties.getBaseUrl())
                .requestFactory(requestFactory)
                .build();
    }

    private ObjectNode buildGeminiRequest(
            ResumeOptimizationRequest request
    ) {
        ObjectNode geminiRequest = objectMapper.createObjectNode();
        geminiRequest.put("model", properties.getModel());
        geminiRequest.put("input", buildPrompt(request));

        ArrayNode responseFormat = geminiRequest.putArray("response_format");
        ObjectNode textFormat = responseFormat.addObject();
        textFormat.put("type", "text");
        textFormat.put("mime_type", "application/json");
        textFormat.set("schema", resultSchema());

        return geminiRequest;
    }

    private ObjectNode resultSchema() {
        ObjectNode schema = objectMapper.createObjectNode();
        schema.put("type", "object");
        ArrayNode required = schema.putArray("required");
        required.add("overallAssessment");
        required.add("keyWeaknesses");
        required.add("priorityRecommendations");
        required.add("sectionRecommendations");

        ObjectNode propertiesNode = schema.putObject("properties");
        propertiesNode.putObject("overallAssessment").put("type", "string");
        propertiesNode.set("keyWeaknesses", stringArraySchema());
        propertiesNode.set("priorityRecommendations", stringArraySchema());

        ObjectNode sections = propertiesNode.putObject(
                "sectionRecommendations"
        );
        sections.put("type", "array");
        ObjectNode sectionItems = sections.putObject("items");
        sectionItems.put("type", "object");
        ArrayNode sectionRequired = sectionItems.putArray("required");
        sectionRequired.add("section");
        sectionRequired.add("recommendations");
        ObjectNode sectionProperties = sectionItems.putObject("properties");
        sectionProperties.putObject("section").put("type", "string");
        sectionProperties.set("recommendations", stringArraySchema());

        return schema;
    }

    private ObjectNode stringArraySchema() {
        ObjectNode schema = objectMapper.createObjectNode();
        schema.put("type", "array");
        schema.putObject("items").put("type", "string");
        return schema;
    }

    private String buildPrompt(ResumeOptimizationRequest request) {
        return """
                Generate resume improvement recommendations for the selected role.
                Return only the JSON required by the response schema.

                Rules:
                - Never invent candidate experience, skills, education, certifications, or projects.
                - Ground every recommendation in the supplied resume and ATS analysis.
                - Distinguish demonstrated skills from skills the candidate should learn or acquire.
                - Do not rewrite the complete resume.
                - Generate practical section-specific recommendations for the target role.
                - Avoid duplicate recommendations and preserve truthful resume content.

                TARGET ROLE:
                %s

                RESUME TEXT:
                %s

                ATS OVERALL SCORE:
                %d

                CATEGORY SCORES:
                %s

                CATEGORY STATUS:
                %s

                STRENGTHS:
                %s

                IMPROVEMENTS:
                %s

                PRIORITY IMPROVEMENTS:
                %s

                MATCHED SKILLS:
                %s

                MISSING SKILLS:
                %s

                MATCHED EDUCATION:
                %s

                MISSING EDUCATION:
                %s

                MATCHED EXPERIENCE:
                %s

                MISSING EXPERIENCE:
                %s

                MATCHED PROJECTS:
                %s

                MISSING PROJECTS:
                %s

                MATCHED CERTIFICATIONS:
                %s

                MISSING CERTIFICATIONS:
                %s
                """.formatted(
                request.getTargetRole(),
                request.getResumeText(),
                request.getOverallScore(),
                asJson(request.getCategoryScores()),
                asJson(request.getCategoryStatus()),
                asJson(request.getStrengths()),
                asJson(request.getImprovements()),
                asJson(request.getPriorityImprovements()),
                asJson(request.getMatchedSkills()),
                asJson(request.getMissingSkills()),
                asJson(request.getMatchedEducation()),
                asJson(request.getMissingEducation()),
                asJson(request.getMatchedExperience()),
                asJson(request.getMissingExperience()),
                asJson(request.getMatchedProjects()),
                asJson(request.getMissingProjects()),
                asJson(request.getMatchedCertifications()),
                asJson(request.getMissingCertifications())
        );
    }

    private String asJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JacksonException ex) {
            throw new ResumeOptimizationProviderException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unable to prepare the Gemini AI request."
            );
        }
    }

    private void logGeminiFailure(RestClientResponseException ex) {
        log.warn(
                "Gemini API request failed: status={}, category={}, endpoint={}{}"
                        + ", model={}, response={}",
                ex.getStatusCode().value(),
                failureCategory(ex.getStatusCode()),
                properties.getBaseUrl(),
                INTERACTIONS_PATH,
                properties.getModel(),
                redactResponseBody(ex.getResponseBodyAsString())
        );
    }

    private String failureCategory(HttpStatusCode status) {
        if (status.value() == HttpStatus.BAD_REQUEST.value()) {
            return "invalid_request";
        }
        if (status.value() == HttpStatus.UNAUTHORIZED.value()
                || status.value() == HttpStatus.FORBIDDEN.value()) {
            return "authentication_or_permission";
        }
        if (status.value() == HttpStatus.NOT_FOUND.value()) {
            return "invalid_model_or_endpoint";
        }
        if (status.value() == HttpStatus.TOO_MANY_REQUESTS.value()) {
            return "quota_or_rate_limit";
        }
        if (status.is5xxServerError()) {
            return "gemini_server_error";
        }
        return "http_error";
    }

    private String redactResponseBody(String responseBody) {
        if (!StringUtils.hasText(responseBody)) {
            return "<empty>";
        }

        String redacted = redactJsonFields(responseBody);
        String truncated = redacted.length()
                > MAX_LOGGED_RESPONSE_BODY_LENGTH
                ? redacted.substring(0, MAX_LOGGED_RESPONSE_BODY_LENGTH)
                + "...<truncated>"
                : redacted;
        return QUERY_API_KEY_PATTERN.matcher(
                        BEARER_TOKEN_PATTERN.matcher(
                                        GOOGLE_API_KEY_PATTERN.matcher(truncated)
                                                .replaceAll("<redacted>"))
                                .replaceAll("$1<redacted>"))
                .replaceAll("$1<redacted>");
    }

    private String redactJsonFields(String responseBody) {
        try {
            JsonNode response = objectMapper.readTree(responseBody);
            redactSensitiveFields(response);
            return objectMapper.writeValueAsString(response);
        } catch (JacksonException ex) {
            return responseBody;
        }
    }

    private void redactSensitiveFields(JsonNode node) {
        if (node.isArray()) {
            node.forEach(this::redactSensitiveFields);
            return;
        }
        if (!node.isObject()) {
            return;
        }

        ObjectNode objectNode = (ObjectNode) node;
        objectNode.properties().forEach(field -> {
            if (isSensitiveField(field.getKey())) {
                objectNode.put(field.getKey(), "<redacted>");
            } else {
                redactSensitiveFields(field.getValue());
            }
        });
    }

    private boolean isSensitiveField(String fieldName) {
        String normalized = fieldName.toLowerCase();
        return normalized.contains("key")
                || normalized.contains("token")
                || normalized.contains("authorization")
                || normalized.contains("input")
                || normalized.contains("prompt")
                || normalized.contains("resume")
                || normalized.equals("text")
                || normalized.equals("contents");
    }

    private ResumeOptimizationResult parseResult(JsonNode response) {
        JsonNode structuredOutput = extractStructuredOutput(response);
        return ResumeOptimizationResult.builder()
                .overallAssessment(requiredText(
                        structuredOutput,
                        "overallAssessment"
                ))
                .keyWeaknesses(requiredTextList(
                        structuredOutput,
                        "keyWeaknesses"
                ))
                .priorityRecommendations(requiredTextList(
                        structuredOutput,
                        "priorityRecommendations"
                ))
                .sectionRecommendations(parseSections(structuredOutput))
                .provider(PROVIDER_NAME)
                .build();
    }

    private JsonNode extractStructuredOutput(JsonNode response) {
        JsonNode steps = response.path("steps");
        if (!steps.isArray()) {
            throw invalidStructuredOutput();
        }

        for (JsonNode step : steps) {
            if (!"model_output".equals(step.path("type").asText())) {
                continue;
            }
            for (JsonNode content : step.path("content")) {
                String text = content.path("text").asText();
                if (StringUtils.hasText(text)) {
                    try {
                        JsonNode output = objectMapper.readTree(text);
                        if (output.isObject()) {
                            return output;
                        }
                    } catch (JacksonException ex) {
                        throw invalidStructuredOutput();
                    }
                }
            }
        }
        throw invalidStructuredOutput();
    }

    private List<SectionRecommendation> parseSections(JsonNode output) {
        JsonNode sections = output.get("sectionRecommendations");
        if (sections == null || !sections.isArray()) {
            throw invalidStructuredOutput();
        }

        List<SectionRecommendation> recommendations = new ArrayList<>();
        for (JsonNode section : sections) {
            recommendations.add(SectionRecommendation.builder()
                    .section(requiredText(section, "section"))
                    .recommendations(requiredTextList(section, "recommendations"))
                    .build());
        }
        return List.copyOf(recommendations);
    }

    private List<String> requiredTextList(JsonNode node, String field) {
        JsonNode values = node.get(field);
        if (values == null || !values.isArray()) {
            throw invalidStructuredOutput();
        }

        List<String> result = new ArrayList<>();
        for (JsonNode value : values) {
            if (!value.isTextual() || !StringUtils.hasText(value.asText())) {
                throw invalidStructuredOutput();
            }
            result.add(value.asText());
        }
        return List.copyOf(result);
    }

    private String requiredText(JsonNode node, String field) {
        JsonNode value = node.get(field);
        if (value == null || !value.isTextual()
                || !StringUtils.hasText(value.asText())) {
            throw invalidStructuredOutput();
        }
        return value.asText();
    }

    private ResumeOptimizationProviderException invalidStructuredOutput() {
        return new ResumeOptimizationProviderException(
                HttpStatus.BAD_GATEWAY,
                "Gemini AI provider returned an invalid structured response."
        );
    }
}