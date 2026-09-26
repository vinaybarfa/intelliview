package com.vinay.intelliview.exception;

import com.vinay.intelliview.common.enums.ErrorCode;
import com.vinay.intelliview.common.response.ApiResponse;
import com.vinay.intelliview.resume.ats.optimizer.ai.ResumeOptimizationProviderException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex
    ) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(
                        ApiResponse.error(
                                ErrorCode.RESOURCE_NOT_FOUND.name(),
                                ex.getMessage()
                        )
                );
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Object>> handleDuplicateResourceException(
            DuplicateResourceException ex
    ) {

        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(
                        ApiResponse.error(
                                ErrorCode.DUPLICATE_RESOURCE.name(),
                                ex.getMessage()
                        )
                );
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Object>> handleUnauthorizedException(
            UnauthorizedException ex
    ) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(
                        ApiResponse.error(
                                ErrorCode.UNAUTHORIZED.name(),
                                ex.getMessage()
                        )
                );
    }

    @ExceptionHandler(ResumeOptimizationProviderException.class)
    public ResponseEntity<ApiResponse<Object>> handleResumeOptimizationProviderException(
            ResumeOptimizationProviderException ex
    ) {

        return ResponseEntity.status(ex.getStatus())
                .body(
                        ApiResponse.error(
                                ErrorCode.AI_PROVIDER_ERROR.name(),
                                ex.getMessage()
                        )
                );
    }

    @ExceptionHandler(InterviewAIProviderException.class)
    public ResponseEntity<ApiResponse<Object>> handleInterviewAIProviderException(
            InterviewAIProviderException ex
    ) {

        return ResponseEntity.status(ex.getStatus())
                .body(ApiResponse.error(
                        ErrorCode.AI_PROVIDER_ERROR.name(),
                        ex.getMessage()
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(
            MethodArgumentNotValidException ex
    ) {

        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("Request validation failed.");
        return ResponseEntity.badRequest().body(ApiResponse.error(
                ErrorCode.VALIDATION_ERROR.name(),
                message
        ));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> handleMalformedRequest(
            HttpMessageNotReadableException ex
    ) {
        return ResponseEntity.badRequest().body(ApiResponse.error(
                ErrorCode.VALIDATION_ERROR.name(),
                "Malformed request body."
        ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgumentException(
            IllegalArgumentException ex
    ) {
        return ResponseEntity.badRequest().body(ApiResponse.error(
                ErrorCode.VALIDATION_ERROR.name(),
                ex.getMessage()
        ));
    }

    @ExceptionHandler({ObjectOptimisticLockingFailureException.class, DataIntegrityViolationException.class})
    public ResponseEntity<ApiResponse<Object>> handleConflictException(Exception ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiResponse.error(
                ErrorCode.VALIDATION_ERROR.name(),
                "The interview state changed. Refresh and try again."
        ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(              // it can handle any exception which may occur
                                                                                    Exception ex
    ) {

        log.error("Unhandled request processing failure", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(
                        ApiResponse.error(
                                ErrorCode.INTERNAL_SERVER_ERROR.name(),
                                "An unexpected error occurred"
                        )
                );
    }
}
