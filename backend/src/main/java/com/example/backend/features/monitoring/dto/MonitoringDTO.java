package com.example.backend.features.monitoring.dto;

import jakarta.validation.constraints.NotNull;

public class MonitoringDTO {

    @NotNull(message = "Name is needed")
    private String name;

    @NotNull(message = "URL us needed")
    private String url;


    public MonitoringDTO(String name, String url) {
        this.name = name;
        this.url = url;
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
}
