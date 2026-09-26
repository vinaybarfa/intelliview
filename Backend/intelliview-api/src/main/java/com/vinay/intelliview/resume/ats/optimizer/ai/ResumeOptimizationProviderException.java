package com.vinay.intelliview.resume.ats.optimizer.ai;

import org.springframework.http.HttpStatus;

public class ResumeOptimizationProviderException extends RuntimeException {

  private final HttpStatus status;

  public ResumeOptimizationProviderException(HttpStatus status, String message) {
        super(message);
        this.status = status;
  }

    public HttpStatus getStatus() {
        return status;
    }
}
