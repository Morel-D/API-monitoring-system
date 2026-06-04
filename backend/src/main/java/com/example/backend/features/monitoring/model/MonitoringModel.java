package com.example.backend.features.monitoring.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.example.backend.security.model.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "monitoring")
public class MonitoringModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String name;
    public String url;
    public String status;

    private boolean autoCheckEnabled = false;
    private int checkInterval = 1;
    public LocalDateTime lastCheckedAt;

    @CreationTimestamp
    public LocalDateTime createdAt;

    // OWNERSHIP -----------------------------------------
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    
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
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    
    public boolean isAutoCheckEnable() {
        return autoCheckEnabled;
    }
    public void setAutoCheckEnable(boolean autoCheckEnabled) {
        this.autoCheckEnabled = autoCheckEnabled;
    }
    public int getCheckInterval() {
        return checkInterval;
    }
    public void setCheckInterval(int checkInterval) {
        this.checkInterval = checkInterval;
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
