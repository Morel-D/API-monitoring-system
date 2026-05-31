package com.example.backend.features.dashbaord.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashbaordMetricsDTO {
    private long totalServices;
    private long onlineServices;   
    private long offlineServices; 
    private double averageResponseTime; 

    private List<DashboardServiceDTO> recentService;
}
