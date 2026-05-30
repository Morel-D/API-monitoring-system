package com.example.backend.features.monitoring.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class MonitoringDTO {

    @NotNull(message = "Name is needed")
    private String name;

    @NotNull(message = "URL is needed")
    private String url;

    private Boolean autoCheckEnabled = false;   

    @Min(value = 1, message = "Interval must be at least 1 minute")
    private Integer checkIntervalMinutes = 1;   

    // Constructors
    public MonitoringDTO() {}

    public MonitoringDTO(String name, String url) {
        this.name = name;
        this.url = url;
    }

    public MonitoringDTO(String name, String url, Boolean autoCheckEnabled, Integer checkIntervalMinutes) {
        this.name = name;
        this.url = url;
        this.autoCheckEnabled = autoCheckEnabled != null ? autoCheckEnabled : false;
        this.checkIntervalMinutes = checkIntervalMinutes != null ? checkIntervalMinutes : 1;
    }

    // Getters and Setters
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

    public Boolean getAutoCheckEnabled() {
        return autoCheckEnabled;
    }

    public void setAutoCheckEnabled(Boolean autoCheckEnabled) {
        this.autoCheckEnabled = autoCheckEnabled != null ? autoCheckEnabled : false;
    }

    public Integer getCheckIntervalMinutes() {
        return checkIntervalMinutes;
    }

    public void setCheckIntervalMinutes(Integer checkIntervalMinutes) {
        this.checkIntervalMinutes = checkIntervalMinutes != null && checkIntervalMinutes > 0 
                ? checkIntervalMinutes : 1;
    }
}