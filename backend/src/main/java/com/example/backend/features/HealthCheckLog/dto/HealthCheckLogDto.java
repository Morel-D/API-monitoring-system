package com.example.backend.features.HealthCheckLog.dto;

public class HealthCheckLogDto {
    private Long serviceId;

    public HealthCheckLogDto(Long serviceId) {
        this.serviceId = serviceId;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public void setServiceId(Long serviceId) {
        this.serviceId = serviceId;
    }
}
