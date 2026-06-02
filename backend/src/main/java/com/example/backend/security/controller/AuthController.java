package com.example.backend.security.controller;

import com.example.backend.security.dto.AuthResponse;
import com.example.backend.security.dto.LoginRequest;
import com.example.backend.security.dto.RegisterRequest;
import com.example.backend.security.model.User;
import com.example.backend.security.service.AuthService;
import com.example.backend.shared.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ApiResponse<>(true, response, "done", null, LocalDateTime.now());
    }

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return new ApiResponse<>(true, response, "done", null, LocalDateTime.now());
    }


    @GetMapping("/me")
    public ApiResponse<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return new ApiResponse<>(false, null, "Unauthorized", null, LocalDateTime.now());
        }

        String email = authentication.getName();
        User user = authService.getCurrentUser(email); 

        return new ApiResponse<>(
            true,
            user,
            "done",
            null,
            LocalDateTime.now()
        );
    }
}