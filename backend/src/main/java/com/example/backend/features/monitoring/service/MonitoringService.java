package com.example.backend.features.monitoring.service;
import com.example.backend.features.monitoring.controller.MonitoringController;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.features.monitoring.dto.MonitoringDTO;
import com.example.backend.features.monitoring.mapper.MonitoringMapper;
import com.example.backend.features.monitoring.model.MonitoringModel;
import com.example.backend.features.monitoring.repository.MonitoringRepository;

@Service
public class MonitoringService {

    
    private final MonitoringRepository repository;

    public MonitoringService(MonitoringRepository repository) {
        this.repository = repository;
    }

    // POST Service ---------------------------------------
    public MonitoringMapper create(MonitoringDTO dto){

        MonitoringModel model = new MonitoringModel();
        model.setName(dto.getName());
        model.setUrl(dto.getUrl());
        model.setStatus("true");
        model.setLastCheckedAt(LocalDateTime.now());

        MonitoringModel save = repository.save(model);

        return convertToMapper(save);
    }

    // GET Service ----------------------------------------
    public List<MonitoringMapper> getAll() {
        List<MonitoringModel> models = repository.findAll();
            return models.stream().map(this::convertToMapper).collect(Collectors.toList());
    }

    // GET Service {id} -----------------------------------

    public MonitoringMapper getById(Long id) {
        MonitoringModel model = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Monitoring_not_found"));

        return convertToMapper(model);
    }

    // PUT Service {id} --------------------------------

    public MonitoringMapper update(Long id, MonitoringDTO dto){
        MonitoringModel existing = repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Monitoring_not_found"));

        existing.setName(dto.getName());
        existing.setUrl(dto.getUrl());

        MonitoringModel updates = repository.save(existing);

        return convertToMapper(updates);
    }


    // DELETE Service {id} --------------------------------
    
    public void delete(Long id) {
        if(!repository.existsById(id)){
            throw new IllegalArgumentException("Monitoring_not_found");
        }
        repository.deleteById(id);
    }

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



    // Helper method to convert Model -> mapper
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

}

