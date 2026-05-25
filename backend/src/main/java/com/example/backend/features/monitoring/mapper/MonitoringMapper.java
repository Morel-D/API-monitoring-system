package com.example.backend.features.monitoring.mapper;

import java.time.LocalDateTime;

public class MonitoringMapper {

    public Long id;
    public String name;
    public String url;
    public String status;
    public LocalDateTime lastCheckedAt;
    public LocalDateTime createdAt;

    
    public MonitoringMapper(Long id, String name, String url, String status, LocalDateTime lastCheckedAt,
            LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.status = status;
        this.lastCheckedAt = lastCheckedAt;
        this.createdAt = createdAt;
    }


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getUrl() {
        return url;
    }
    public void setUrl(String url) {
        this.url = url;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public LocalDateTime getLastCheckedAt() {
        return lastCheckedAt;
    }
    public void setLastCheckedAt(LocalDateTime lastCheckedAt) {
        this.lastCheckedAt = lastCheckedAt;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}
