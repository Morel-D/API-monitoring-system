package com.example.backend.monitoring.service;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend.monitoring.dto.MonitoringDTO;
import com.example.backend.monitoring.mapper.MonitoringMapper;
import com.example.backend.monitoring.model.MonitoringModel;
import com.example.backend.monitoring.repository.MonitoringRepository;

@Service
public class MonitoringService {

    @Autowired
    private MonitoringRepository repository;

    // POST Service ---------------------------------------
    public MonitoringMapper create(MonitoringDTO dto){

        MonitoringModel model = new MonitoringModel();
        model.setName(dto.getName());
        model.setUrl(dto.getUrl());
        model.setStatus("true");
        model.setLastCheckedAt(LocalDateTime.now());

        MonitoringModel save = repository.save(model);

        return new MonitoringMapper(
            save.id, 
            save.name, 
            save.url, 
            save.status, 
            save.lastCheckedAt, 
            save.createdAt
        );
    }

    // GET Service ----------------------------------------

    // GET Service {id} -----------------------------------

    // DELETE Service {id} --------------------------------

}
