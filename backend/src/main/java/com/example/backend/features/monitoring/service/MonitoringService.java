package com.example.backend.features.monitoring.service;
import com.example.backend.features.HealthCheckLog.model.HealthCheckLogModel;
import com.example.backend.features.HealthCheckLog.repository.HealthCheckRepository;
import com.example.backend.features.audit.service.AuditLogService;
import com.example.backend.features.dashbaord.dto.DashbaordMetricsDTO;
import com.example.backend.features.dashbaord.dto.DashboardServiceDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.backend.features.monitoring.dto.MonitoringDTO;
import com.example.backend.features.monitoring.mapper.MonitoringMapper;
import com.example.backend.features.monitoring.model.MonitoringModel;
import com.example.backend.features.monitoring.repository.MonitoringRepository;
import com.example.backend.security.model.User;
import com.example.backend.shared.enums.AuditAction;

@Service
public class MonitoringService {

    
    private final MonitoringRepository repository;
    private final HealthCheckRepository healthCheckRepository;
    private final AuditLogService auditLogService;

    public MonitoringService(MonitoringRepository repository, HealthCheckRepository healthCheckRepository, AuditLogService auditLogService) {
        this.repository = repository;
        this.healthCheckRepository = healthCheckRepository;
        this.auditLogService = auditLogService;
    }

    // POST Service ---------------------------------------
    public MonitoringMapper create(MonitoringDTO dto, User currentUser){

        MonitoringModel model = new MonitoringModel();
        model.setName(dto.getName());
        model.setUrl(dto.getUrl());
        model.setStatus("true");
        model.setUser(currentUser);
        model.setLastCheckedAt(LocalDateTime.now());

        // === Handle autoCheckEnabled and checkInterval properly ===
        boolean autoCheckEnabled = dto.getAutoCheckEnabled() != null ? dto.getAutoCheckEnabled() : false;
        int checkInterval;

            if (autoCheckEnabled) {
                // Only use provided interval if auto-check is enabled
                checkInterval = (dto.getCheckIntervalMinutes() != null && dto.getCheckIntervalMinutes() > 0) 
                                ? dto.getCheckIntervalMinutes() 
                                : 1;   // default
            } else {
                // If auto-check is disabled, force default interval
                checkInterval = 1;
            }

            model.setAutoCheckEnable(autoCheckEnabled);
            model.setCheckInterval(checkInterval);

        MonitoringModel save = repository.save(model);

        auditLogService.logAction(
            currentUser, 
            AuditAction.USER_CREATED_SERVICE, 
            "SERVICE", 
            save.getId(),
            "Created service: " + save.getName()
        );

        return convertToMapper(save);
    }

    // GET Service ----------------------------------------
    public List<MonitoringMapper> getAll() {
        List<MonitoringModel> models = repository.findAll();
            return models.stream().map(this::convertToMapper).collect(Collectors.toList());
    }

    // GET By USER Service ----------------------------------------
    public Page<MonitoringMapper> getAllByCurrentUser(User currentUser, Pageable pageable) {
    Page<MonitoringModel> page = repository.findByUser(currentUser, pageable);
    return page.map(this::convertToMapper);
}

    // GET Service {id} -----------------------------------

    public MonitoringMapper getById(Long id, User currentUser) {
        MonitoringModel model = repository.findByIdAndUser(id, currentUser).orElseThrow(() -> new IllegalArgumentException("Monitoring_not_found"));

        return convertToMapper(model);
    }

    // PUT Service {id} --------------------------------

    public MonitoringMapper update(Long id, MonitoringDTO dto, User currentUser){
        MonitoringModel existing = repository.findByIdAndUser(id, currentUser).orElseThrow(() -> new IllegalArgumentException("Monitoring_not_found"));

        existing.setName(dto.getName());
        existing.setUrl(dto.getUrl());

        MonitoringModel updates = repository.save(existing);

        auditLogService.logAction(
            currentUser, 
            AuditAction.USER_UPDATED_SERVICE, 
            "SERVICE", 
            updates.getId(),
            "Created service: " + updates.getName()
        );

        return convertToMapper(updates);
    }

    // DELETE Service {id} --------------------------------
    
    public void delete(Long id, User currentUser) {
        repository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new IllegalArgumentException("Monitoring_not_found"));
         repository.deleteById(id);

    }


    // ..............
    public List<MonitoringModel> getServiceDueForCheck() {
        return repository.findServicesDueForCheck();
    }

    public void enableAutoCheck(Long serviceId, boolean enabled, Integer intervalMinutes) {
        MonitoringModel service = repository.findById(serviceId).orElseThrow(() -> new IllegalArgumentException("Monitoring_not_found"));

        service.setAutoCheckEnable(enabled);

        if(intervalMinutes != null && intervalMinutes > 0){
            service.setCheckInterval(intervalMinutes);
        }else if (enabled){
            service.setCheckInterval(1);
        }
        repository.save(service);

    }


    public DashbaordMetricsDTO getDashbaordMetrics(User currentUser) {
        List<MonitoringModel> allService = repository.findByUser(currentUser);

        long total = allService.size();
        long online = allService.stream().filter(s -> "true".equalsIgnoreCase(s.getStatus())).count();
        long offline = allService.stream().filter(s -> "false".equalsIgnoreCase(s.getStatus())).count();

        double avgResponseTime = calaculateAverageResponseTime();

        // Get recnt services (first 3 only)
        List<DashboardServiceDTO> recentService = allService.stream().limit(3).map(this::convertToDashboardServiceDTO).toList();

        return new DashbaordMetricsDTO(total, online, offline, avgResponseTime, recentService);
    }


    // Helper method ---------------------------------------------------

    private double calaculateAverageResponseTime(){
        List<HealthCheckLogModel> latestCheck = healthCheckRepository.findLatestCheckPerService();

        if(latestCheck.isEmpty()){
            return 0.0;
        }

        double sum = latestCheck.stream().mapToLong(log -> log.getResponseTime() != null ? log.getResponseTime().toMillis() : 0).sum();

        return sum/latestCheck.size();
    }

    private MonitoringMapper convertToMapper(MonitoringModel model) {
        return new MonitoringMapper(
            model.getId(),
            model.getName(),
            model.getUrl(),
            model.getStatus(), 
            model.isAutoCheckEnable(),
            model.getCheckInterval(),
            model.getLastCheckedAt(), 
            model.getCreatedAt()
        );
    }

    private DashboardServiceDTO convertToDashboardServiceDTO(MonitoringModel model) {

        HealthCheckLogModel latestLog = healthCheckRepository.findTopByMonitoringIdOrderByCheckedAtDesc(model.getId()).orElse(null);

        String lastResponse = "-";
        String lastChecked = "Never";

        if(latestLog != null){
            lastResponse = latestLog.getResponseTime() != null ? latestLog.getResponseTime().toMillis() + " ms" : "-";

            lastChecked = latestLog.getCheckedAt() != null ? latestLog.getCheckedAt().toString() : "Never";
        }


        return new DashboardServiceDTO(
            model.getId(), 
            model.getName(),
            model.getUrl(), 
            model.getStatus(), 
            lastResponse,
            lastChecked
        );
    }
}

