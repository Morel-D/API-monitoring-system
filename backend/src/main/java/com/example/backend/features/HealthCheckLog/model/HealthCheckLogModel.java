package com.example.backend.features.HealthCheckLog.model;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.example.backend.features.monitoring.model.MonitoringModel;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "heathcheck")
public class HealthCheckLogModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "serviceId")
    private MonitoringModel monitoring;
    
    private BigDecimal statusCode;
    private Duration responseTime;
    private Boolean sucess;
    private String message;
    private String status;
    
    @CreationTimestamp
    private LocalDateTime checkedAt;


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
