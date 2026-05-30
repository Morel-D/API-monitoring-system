package com.example.backend.features.HealthCheckLog.utils;

import java.util.List;

import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.backend.features.HealthCheckLog.service.HealthCheckService;
import com.example.backend.features.monitoring.model.MonitoringModel;
import com.example.backend.features.monitoring.service.MonitoringService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class HealthCheckScheduler {

    @Lazy
    private final MonitoringService monitoringService;
    private final HealthCheckService healthCheckService;

    @Scheduled(fixedRate = 60000)
    public void checkEnableService() {
        log.debug("Running scheduled health checks...");

        List<MonitoringModel> serviceToCheck = monitoringService.getServiceDueForCheck();

        if (serviceToCheck.isEmpty()) {
                log.debug("No services due for auto-check at this time.");
                return;
        }

        for(MonitoringModel service : serviceToCheck) {
            try {
                healthCheckService.performHealthCheck(service.getId());
            }catch (Exception e) {
                log.error("Auto-check failed for service {}: {}", service.getName(), e.getMessage());
            }
        }
    }
}
