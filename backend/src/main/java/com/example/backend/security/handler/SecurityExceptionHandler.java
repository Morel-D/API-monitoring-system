package com.example.backend.security.handler;

import com.example.backend.shared.api.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class SecurityExceptionHandler {

    // Wrong Email or Password
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Object>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            new ApiResponse<>(
                false,
                null,
                "Invalid email or password",
                "INVALID_CREDENTIALS",
                LocalDateTime.now()
            )
        );
    }

    // JWT Token Expired
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiResponse<Object>> handleExpiredJwt(ExpiredJwtException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            new ApiResponse<>(
                false,
                null,
                "Token has expired. Please login again",
                "TOKEN_EXPIRED",
                LocalDateTime.now()
            )
        );
    }

    // Invalid JWT Signature
    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ApiResponse<Object>> handleInvalidSignature(SignatureException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            new ApiResponse<>(
                false,
                null,
                "Invalid token signature",
                "INVALID_TOKEN",
                LocalDateTime.now()
            )
        );
    }

    // General JWT / Security Errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleSecurityException(Exception ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
            new ApiResponse<>(
                false,
                null,
                "Authentication failed",
                "AUTHENTICATION_ERROR",
                LocalDateTime.now()
            )
        );
    }
}