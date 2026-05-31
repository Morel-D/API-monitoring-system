package com.example.backend.features.dashbaord.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardServiceDTO {

    private Long id;
    private String name;
    private String url;
    private String status;
    private String lastResponse;
    private String lastChecked;
}
