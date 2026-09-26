package com.vinay.intelliview.exception;

import org.springframework.http.HttpStatus;

public class InterviewAIProviderException extends RuntimeException {
    private final HttpStatus status;

    public InterviewAIProviderException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}