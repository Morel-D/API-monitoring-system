package com.example.backend.security.handler;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.example.backend.shared.api.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityExceptionConfig
        implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final ObjectMapper mapper;

    public SecurityExceptionConfig() {
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
    }

    // No token / expired / malformed → 401
    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        String reason = (String) request.getAttribute("jwt_error");
        writeResponse(response, HttpStatus.UNAUTHORIZED,
                reason != null ? reason : "authentication_required");
    }

    // Valid token but wrong role → 403
    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException ex) throws IOException {

        writeResponse(response, HttpStatus.FORBIDDEN, "access_denied");
    }

    private void writeResponse(HttpServletResponse response,
                                HttpStatus status,
                                String message) throws IOException {

    ApiResponse<Object> body = new ApiResponse<>(
            false,
            null,
            "token_error",
            message,
            LocalDateTime.now()
    );

        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(mapper.writeValueAsString(body));
    }
}