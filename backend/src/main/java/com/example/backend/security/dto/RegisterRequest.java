package com.example.backend.security.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name_required")
    private String name;

    @NotBlank(message = "Email_required")
    @Email(message = "Invalid_email_format")
    private String email;

    @NotBlank(message = "Password_required")
    @Size(min = 6, message = "Password_to_weak")
    private String password;
}
