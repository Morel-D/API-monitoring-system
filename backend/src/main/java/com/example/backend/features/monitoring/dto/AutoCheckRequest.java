package com.example.backend.features.monitoring.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AutoCheckRequest {
    @NotNull(message = "Enabled field is required")
    private boolean enabled;

    @Min(value = 1, message = "Interval must be at least 1 minute")
    private int intervalMinutes;
}
