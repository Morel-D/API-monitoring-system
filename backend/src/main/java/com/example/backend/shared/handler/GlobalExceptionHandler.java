package com.example.backend.shared.handler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.security.core.AuthenticationException;

import com.example.backend.shared.api.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Validation Error
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handlerValidationError(MethodArgumentNotValidException ex){
        Map<String, String> errors = new HashMap<>();

        for(FieldError error: ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("errors", errors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            new ApiResponse<>(
                false, 
                null,
                "feild_validation_errors",
                errors,
                 null)
        );
    }
    

    // Bussiness Error
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handlerBusinessErrors(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
            new ApiResponse<>(
                false, 
                null,
                ex.getMessage(), 
                null, 
                LocalDateTime.now()
            )
        );
    }

   // Bad credentials (wrong email/password)
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentials(
            BadCredentialsException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            new ApiResponse<>(false, null, "invalid_credentials", null, LocalDateTime.now())
        );
    }

    // Not authenticated (no token / invalid token)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Object>> handleAuthenticationError(
            AuthenticationException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            new ApiResponse<>(false, null, "authentication_required", null, LocalDateTime.now())
        );
    }

    // Authenticated but not authorized (wrong role)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Object>> handleAccessDenied(
            AccessDeniedException ex) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
            new ApiResponse<>(false, null, "access_denied", null, LocalDateTime.now())
        );
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericError(Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.internalServerError().body(
            new ApiResponse<>(
                false,
                null,
                "An unexpected error occurred",
                "SERVER_ERROR",
                LocalDateTime.now()
            )
        );
    }
}