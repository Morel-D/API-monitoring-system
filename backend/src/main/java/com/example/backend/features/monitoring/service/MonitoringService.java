package com.example.backend.features.monitoring.service;
import com.example.backend.features.HealthCheckLog.model.HealthCheckLogModel;
import com.example.backend.features.HealthCheckLog.repository.HealthCheckRepository;
import com.example.backend.features.dashbaord.dto.DashbaordMetricsDTO;
import com.example.backend.features.dashbaord.dto.DashboardServiceDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.backend.features.monitoring.dto.MonitoringDTO;
import com.example.backend.features.monitoring.mapper.MonitoringMapper;
import com.example.backend.features.monitoring.model.MonitoringModel;
import com.example.backend.features.monitoring.repository.MonitoringRepository;
import com.example.backend.security.model.User;

@Service
public class MonitoringService {

    
    private final MonitoringRepository repository;
    private final HealthCheckRepository healthCheckRepository;

    public MonitoringService(MonitoringRepository repository, HealthCheckRepository healthCheckRepository) {
        this.repository = repository;
        this.healthCheckRepository = healthCheckRepository;
    }

    // POST Service ---------------------------------------
    public MonitoringMapper create(MonitoringDTO dto, User currentUser){

        MonitoringModel model = new MonitoringModel();
        model.setName(dto.getName());
        model.setUrl(dto.getUrl());
        model.setStatus("true");
        model.setUser(currentUser);
        model.setLastCheckedAt(LocalDateTime.now());

        MonitoringModel save = repository.save(model);

        return convertToMapper(save);
    }

    // GET Service ----------------------------------------
    public List<MonitoringMapper> getAll() {
        List<MonitoringModel> models = repository.findAll();
            return models.stream().map(this::convertToMapper).collect(Collectors.toList());
    }

    // GET By USER Service ----------------------------------------
    public List<MonitoringMapper> getAllByCurrentUser(User currentUser) {
    List<MonitoringModel> models = repository.findByUser(currentUser);
    return models.stream()
                 .map(this::convertToMapper)
                 .collect(Collectors.toList());
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

