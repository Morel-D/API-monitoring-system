package com.example.backend.features.monitoring.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.features.monitoring.dto.MonitoringDTO;
import com.example.backend.features.monitoring.mapper.MonitoringMapper;
import com.example.backend.features.monitoring.service.MonitoringService;
import com.example.backend.shared.api.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/service")
public class MonitoringController {
    

    @Autowired
    private MonitoringService monitoringService;

    // CREATE ----------------------------------
    @PostMapping
    public ApiResponse<MonitoringMapper> create(@Valid @RequestBody MonitoringDTO dto){
        MonitoringMapper response = monitoringService.create(dto);
        return new ApiResponse<MonitoringMapper>(
            true, 
            response, 
            "done", 
            null, 
            LocalDateTime.now()
        );
    }


    // GET ALL ----------------------------------
    @GetMapping
    public ApiResponse<List<MonitoringMapper>> getAll() {
        List<MonitoringMapper> response = monitoringService.getAll();
        return new ApiResponse<List<MonitoringMapper>>(
                true,
                response,
                "done",
                null,
                LocalDateTime.now()
        );
    }


    //  GET BY ID ----------------------------------
    @GetMapping("/{id}")
    public ApiResponse<MonitoringMapper> getById(@PathVariable Long id) {
        MonitoringMapper response = monitoringService.getById(id);
        return new ApiResponse<MonitoringMapper>(
                true,
                response,
                "done",
                null,
                LocalDateTime.now()
        );
    }


    // UPDATE ----------------------------------
    @PutMapping("/{id}")
    public ApiResponse<MonitoringMapper> update(@PathVariable Long id,
                                                @Valid @RequestBody MonitoringDTO dto) {
        MonitoringMapper response = monitoringService.update(id, dto);
        return new ApiResponse<MonitoringMapper>(
                true,
                response,
                "done",
                null,
                LocalDateTime.now()
        );
    }


    // DELETE ----------------------------------
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        monitoringService.delete(id);
        return new ApiResponse<Void>(
                true,
                null,
                "done",
                null,
                LocalDateTime.now()
        );
    }


    
}
