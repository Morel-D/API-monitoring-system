package com.example.backend.features.monitoring.mapper;

import java.time.LocalDateTime;

public class MonitoringMapper {

    public Long id;
    public String name;
    public String url;
    public String status;           
    public Boolean latestSuccess;   
    public String latestMessage;   
    public boolean autoCheckEnable;
    public int checkInterval;
    public LocalDateTime lastCheckedAt;
    public LocalDateTime createdAt;

    public MonitoringMapper(Long id, String name, String url, String status,
                            Boolean latestSuccess, String latestMessage,
                            boolean autoCheckEnable, int checkInterval,
                            LocalDateTime lastCheckedAt, LocalDateTime createdAt) {
        
        this.id = id;
        this.name = name;
        this.url = url;
        this.status = status;
        this.latestSuccess = latestSuccess;
        this.latestMessage = latestMessage;
        this.autoCheckEnable = autoCheckEnable;
        this.checkInterval = checkInterval;
        this.lastCheckedAt = lastCheckedAt;
        this.createdAt = createdAt;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getUrl() { return url; }
    public String getStatus() { return status; }
    
    public Boolean getLatestSuccess() { return latestSuccess; }
    public String getLatestMessage() { return latestMessage; }

    public boolean isAutoCheckEnable() { return autoCheckEnable; }
    public int getCheckInterval() { return checkInterval; }
    public LocalDateTime getLastCheckedAt() { return lastCheckedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}