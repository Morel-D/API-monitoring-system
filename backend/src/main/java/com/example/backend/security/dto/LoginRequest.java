package com.example.backend.security.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Email_required")
    private String email;

    @NotBlank(message = "Password_required")
    private String password;
}
