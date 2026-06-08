package com.example.backend.features.HealthCheckLog.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.features.HealthCheckLog.mapper.HealthCheckLogMapper;
import com.example.backend.features.HealthCheckLog.service.HealthCheckService;
import com.example.backend.shared.api.ApiResponse;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    @Autowired
    private HealthCheckService healthCheckService;


    // GET ALL ----------------------------------
    @GetMapping
    public ApiResponse<List<HealthCheckLogMapper>> getAll() {
        List<HealthCheckLogMapper> response = healthCheckService.getAllChecks();
        return new ApiResponse<List<HealthCheckLogMapper>>(
                true,
                response,
                "done",
                null,
                LocalDateTime.now()
        );
    }


    // GET BY SERVICE ID ------------------------
    @GetMapping("/service/{serviceId}")
    public ApiResponse<Page<HealthCheckLogMapper>> getByServiceId(@PathVariable Long serviceId, Pageable pageable) {
        try {
            Page<HealthCheckLogMapper> response = healthCheckService.getByServiceID(serviceId, pageable);
            
            return new ApiResponse<>(
                    true,
                    response,
                    "done",
                    null,
                    LocalDateTime.now()
            );
            
        } catch (IllegalArgumentException e) {
            return new ApiResponse<>(
                    false,
                    null,
                    e.getMessage(),
                    null,
                    LocalDateTime.now()
            );
        }
    }



}
