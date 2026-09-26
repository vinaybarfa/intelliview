package com.vinay.intelliview.interview.ai;

import java.net.http.HttpClient;
import java.util.ArrayList;
import java.util.List;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.node.ObjectNode;
import com.vinay.intelliview.exception.InterviewAIProviderException;
import com.vinay.intelliview.resume.ats.optimizer.ai.GeminiProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import tools.jackson.databind.ObjectMapper;


import lombok.RequiredArgsConstructor;
import tools.jackson.databind.node.ArrayNode;


@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
        prefix = "intelliview.ai",
        name = "provider",
        havingValue = "gemini"
)
public class GeminiInterviewAIProvider implements InterviewAIProvider {

    private static final String INTERACTIONS_PATH = "/interactions";

    private final GeminiProperties properties;
    private final ObjectMapper objectMapper;
    private final RestClient.Builder restClientBuilder;

    @Override
    public InterviewQuestionGenerationResult generateQuestions(
            InterviewQuestionGenerationRequest request
    ) {
        validateQuestionRequest(request);
        JsonNode output = invokeGemini(questionRequest(request));
        return new InterviewQuestionGenerationResult(
                requiredQuestions(output, request.questionCount())
        );
    }

    @Override
    public InterviewAnswerEvaluationResult evaluateAnswer(
            InterviewAnswerEvaluationRequest request
    ) {
        validateEvaluationRequest(request);
        JsonNode output = invokeGemini(evaluationRequest(request));
        return new InterviewAnswerEvaluationResult(
                requiredScore(output, "technicalScore"),
                requiredScore(output, "communicationScore"),
                requiredScore(output, "confidenceScore"),
                requiredScore(output, "overallScore"),
                requiredText(output, "feedback")
        );
    }

    private JsonNode invokeGemini(ObjectNode request) {
        if (!StringUtils.hasText(properties.getApiKey())) {
            throw new InterviewAIProviderException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini AI provider is not configured."
            );
        }

        try {
            JsonNode response = restClient().post()
                    .uri(INTERACTIONS_PATH)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("x-goog-api-key", properties.getApiKey())
                    .body(request)
                    .retrieve()
                    .body(JsonNode.class);
            return extractStructuredOutput(response);
        } catch (InterviewAIProviderException ex) {
            throw ex;
        } catch (RestClientResponseException ex) {
            throw new InterviewAIProviderException(
                    HttpStatus.BAD_GATEWAY,
                    "Gemini AI provider returned an unsuccessful response."
            );
        } catch (ResourceAccessException ex) {
            throw new InterviewAIProviderException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Gemini AI provider is temporarily unavailable."
            );
        } catch (RuntimeException ex) {
            throw new InterviewAIProviderException(
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

    private tools.jackson.databind.node.ObjectNode questionRequest(InterviewQuestionGenerationRequest request) {
        return geminiRequest(questionPrompt(request), questionsSchema());
    }

    private tools.jackson.databind.node.ObjectNode evaluationRequest(InterviewAnswerEvaluationRequest request) {
        return geminiRequest(evaluationPrompt(request), evaluationSchema());
    }

    private tools.jackson.databind.node.ObjectNode geminiRequest(String prompt, ObjectNode schema) {
        tools.jackson.databind.node.ObjectNode request = objectMapper.createObjectNode();
        request.put("model", properties.getModel());
        request.put("input", prompt);

        tools.jackson.databind.node.ArrayNode responseFormat = request.putArray("response_format");
        tools.jackson.databind.node.ObjectNode textFormat = responseFormat.addObject();
        textFormat.put("type", "text");
        textFormat.put("mime_type", "application/json");
        textFormat.set("schema", schema);
        return request;
    }

    private ObjectNode questionsSchema() {
        tools.jackson.databind.node.ObjectNode schema = objectMapper.createObjectNode();
        schema.put("type", "object");
        schema.putArray("required").add("questions");
        tools.jackson.databind.node.ObjectNode questions = schema.putObject("properties")
                .putObject("questions");
        questions.put("type", "array");
        questions.putObject("items").put("type", "string");
        return schema;
    }

    private ObjectNode evaluationSchema() {
        tools.jackson.databind.node.ObjectNode schema = objectMapper.createObjectNode();
        schema.put("type", "object");
        ArrayNode required = schema.putArray("required");
        required.add("technicalScore");
        required.add("communicationScore");
        required.add("confidenceScore");
        required.add("overallScore");
        required.add("feedback");

        tools.jackson.databind.node.ObjectNode fields = schema.putObject("properties");
        scoreSchema(fields, "technicalScore");
        scoreSchema(fields, "communicationScore");
        scoreSchema(fields, "confidenceScore");
        scoreSchema(fields, "overallScore");
        fields.putObject("feedback").put("type", "string");
        return schema;
    }

    private void scoreSchema(ObjectNode fields, String field) {
        ObjectNode score = fields.putObject(field);
        score.put("type", "integer");
        score.put("minimum", 0);
        score.put("maximum", 100);
    }

    private String questionPrompt(InterviewQuestionGenerationRequest request) {
        return """
                Generate exactly %d distinct technical/software interview questions
                for the target role below. Return only the JSON required by the
                response schema.

                TARGET ROLE:
                %s
                """.formatted(request.questionCount(), request.targetRole());
    }

    private String evaluationPrompt(InterviewAnswerEvaluationRequest request) {
        return """
                Evaluate the candidate's interview answer for the target role.
                Score technical correctness, communication, confidence, and overall
                performance from 0 to 100. Give concise, constructive feedback.
                Return only the JSON required by the response schema.

                TARGET ROLE:
                %s

                QUESTION:
                %s

                CANDIDATE ANSWER:
                %s
                """.formatted(
                request.targetRole(), request.question(), request.answer()
        );
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
                if (!StringUtils.hasText(text)) {
                    continue;
                }
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
        throw invalidStructuredOutput();
    }

    private List<String> requiredQuestions(JsonNode output, int questionCount) {
        JsonNode questions = output.get("questions");
        if (questions == null || !questions.isArray()
                || questions.size() != questionCount) {
            throw invalidStructuredOutput();
        }

        List<String> result = new ArrayList<>(questionCount);
        for (JsonNode question : questions) {
            if (!question.isTextual() || !StringUtils.hasText(question.asText())) {
                throw invalidStructuredOutput();
            }
            result.add(question.asText());
        }
        return List.copyOf(result);
    }

    private int requiredScore(JsonNode output, String field) {
        JsonNode score = output.get(field);
        if (score == null || !score.isIntegralNumber()
                || score.intValue() < 0 || score.intValue() > 100) {
            throw invalidStructuredOutput();
        }
        return score.intValue();
    }

    private String requiredText(JsonNode output, String field) {
        JsonNode value = output.get(field);
        if (value == null || !value.isTextual()
                || !StringUtils.hasText(value.asText())) {
            throw invalidStructuredOutput();
        }
        return value.asText();
    }

    private void validateQuestionRequest(InterviewQuestionGenerationRequest request) {
        if (request == null || !StringUtils.hasText(request.targetRole())
                || request.questionCount() == null || request.questionCount() < 1) {
            throw new InterviewAIProviderException(
                    HttpStatus.BAD_REQUEST,
                    "Interview question request is invalid."
            );
        }
    }

    private void validateEvaluationRequest(InterviewAnswerEvaluationRequest request) {
        if (request == null || !StringUtils.hasText(request.targetRole())
                || !StringUtils.hasText(request.question())
                || !StringUtils.hasText(request.answer())) {
            throw new InterviewAIProviderException(
                    HttpStatus.BAD_REQUEST,
                    "Interview answer evaluation request is invalid."
            );
        }
    }

    private InterviewAIProviderException invalidStructuredOutput() {
        return new InterviewAIProviderException(
                HttpStatus.BAD_GATEWAY,
                "Gemini AI provider returned an invalid structured response."
        );
    }
}