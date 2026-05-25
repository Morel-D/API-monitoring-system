package com.example.backend.features.HealthCheckLog.mapper;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

import com.example.backend.features.monitoring.model.MonitoringModel;

public class HealthCheckLogMapper {


    private Long id;    
    private MonitoringModel monitoring;
    private BigDecimal statusCode;
    private Duration responseTime;
    private Boolean sucess;
    private String message;
    private String status;
    private LocalDateTime checkedAt;


    public HealthCheckLogMapper(Long id, MonitoringModel monitoring, BigDecimal statusCode, Duration responseTime,
            Boolean sucess, String message, String status, LocalDateTime checkedAt) {
        this.id = id;
        this.monitoring = monitoring;
        this.statusCode = statusCode;
        this.responseTime = responseTime;
        this.sucess = sucess;
        this.message = message;
        this.status = status;
        this.checkedAt = checkedAt;
    }


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public MonitoringModel getService() {
        return monitoring;
    }
    public void setService(MonitoringModel monitoring) {
        this.monitoring = monitoring;
    }
    public BigDecimal getStatusCode() {
        return statusCode;
    }
    public void setStatusCode(BigDecimal statusCode) {
        this.statusCode = statusCode;
    }
    public Duration getResponseTime() {
        return responseTime;
    }
    public void setResponseTime(Duration responseTime) {
        this.responseTime = responseTime;
    }
    public Boolean getSucess() {
        return sucess;
    }
    public void setSucess(Boolean sucess) {
        this.sucess = sucess;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDateTime getCheckedAt() {
        return checkedAt;
    }
    public void setCheckedAt(LocalDateTime checkedAt) {
        this.checkedAt = checkedAt;
    }
}
