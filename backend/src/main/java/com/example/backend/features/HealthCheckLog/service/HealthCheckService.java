package com.example.backend.features.HealthCheckLog.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.backend.features.HealthCheckLog.mapper.HealthCheckLogMapper;
import com.example.backend.features.HealthCheckLog.model.HealthCheckLogModel;
import com.example.backend.features.HealthCheckLog.repository.HealthCheckRepository;
import com.example.backend.features.monitoring.model.MonitoringModel;
import com.example.backend.features.monitoring.repository.MonitoringRepository;

@Service
public class HealthCheckService {

    @Autowired
    private HealthCheckRepository repository;

    @Autowired
    private MonitoringRepository serviceRepository;


    public HealthCheckLogMapper performHealthCheck(Long serviceId) {
        MonitoringModel monitoring = serviceRepository.findById(serviceId).orElseThrow(() -> new IllegalArgumentException("service_not_found"));

        HealthCheckLogModel log = new HealthCheckLogModel();
        log.setService(monitoring);
        log.setCheckedAt(LocalDateTime.now());

        long startTime = System.currentTimeMillis();

        try{
            // Make HTTP Call
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.getForEntity(monitoring.getUrl(), String.class);

            long responseTimeMs = System.currentTimeMillis() - startTime;

            log.setStatusCode(BigDecimal.valueOf(response.getStatusCode().value()));
            log.setResponseTime(Duration.ofMillis(responseTimeMs));
            log.setSucess(true);
            log.setStatus("true");
            log.setMessage("UP");
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            long responseTimeMs = System.currentTimeMillis() - startTime;
            
            log.setStatusCode(BigDecimal.valueOf(e.getStatusCode().value()));
            log.setResponseTime(Duration.ofMillis(responseTimeMs));
            log.setSucess(false);
            log.setStatus("true");
            log.setMessage("DOWN");
        } catch (Exception e){
            long responseTimeMs = System.currentTimeMillis() - startTime;

            log.setStatusCode(BigDecimal.valueOf(0));
            log.setResponseTime(Duration.ofMillis(responseTimeMs));
            log.setSucess(false);
            log.setStatus("false");
            log.setMessage("DOWN");
        }

        HealthCheckLogModel saveLog = repository.save(log);

        ///
        monitoring.setLastCheckedAt(LocalDateTime.now());
        serviceRepository.save(monitoring);

        return convertToHealthCheckMapper(saveLog);
    }

    public List<HealthCheckLogMapper> getAllChecks() {
        List<HealthCheckLogModel> models = repository.findAll();
        return models.stream().map(this::convertToHealthCheckMapper).collect(Collectors.toList());
    }

        public List<HealthCheckLogMapper> getByServiceID(Long serviceId) {
                if (serviceId == null) {
                    throw new IllegalArgumentException("Service ID cannot be null");
                }

                List<HealthCheckLogModel> logs = repository.findByMonitoringIdOrderByCheckedAtDesc(serviceId);
                
                if (logs.isEmpty()) {
                    return Collections.emptyList();
                }

                return logs.stream()
                        .map(this::convertToHealthCheckMapper)
                        .collect(Collectors.toList());
            }

    private HealthCheckLogMapper convertToHealthCheckMapper(HealthCheckLogModel log) {
        return new HealthCheckLogMapper(
            log.getId(),
            log.getService(),
            log.getStatusCode(),
            log.getResponseTime(),
            log.getSucess(),
            log.getMessage(),
            log.getStatus(),
            log.getCheckedAt()
        );
    }

}
