package com.example.backend.features.monitoring.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.features.HealthCheckLog.mapper.HealthCheckLogMapper;
import com.example.backend.features.HealthCheckLog.service.HealthCheckService;
import com.example.backend.features.dashbaord.dto.DashbaordMetricsDTO;
import com.example.backend.features.monitoring.dto.AutoCheckRequest;
import com.example.backend.features.monitoring.dto.MonitoringDTO;
import com.example.backend.features.monitoring.mapper.MonitoringMapper;
import com.example.backend.features.monitoring.service.MonitoringService;
import com.example.backend.security.model.User;
import com.example.backend.shared.api.ApiResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/service")
public class MonitoringController {
    

    @Autowired
    private MonitoringService monitoringService;

    @Autowired
    private HealthCheckService healthCheckService;

    // CREATE ----------------------------------
    @PostMapping
    public ApiResponse<MonitoringMapper> create(@Valid @RequestBody MonitoringDTO dto, Authentication authentication){

        User currentUser = (User) authentication.getPrincipal();
        System.out.println("User --> "+ currentUser);

        MonitoringMapper response = monitoringService.create(dto, currentUser);
        return new ApiResponse<MonitoringMapper>(
            true, 
            response, 
            "done", 
            null, 
            LocalDateTime.now()
        );
    }


    // GET ALL (BY USER) ----------------------------------
    @GetMapping
    public ApiResponse<List<MonitoringMapper>> getAll(Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();

        List<MonitoringMapper> response = monitoringService.getAllByCurrentUser(currentUser);
        // List<MonitoringMapper> response = monitoringService.getAll();
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
    public ApiResponse<MonitoringMapper> getById(@PathVariable Long id, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();

        MonitoringMapper response = monitoringService.getById(id, currentUser);
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
                                                @Valid @RequestBody MonitoringDTO dto, Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();

        MonitoringMapper response = monitoringService.update(id, dto, currentUser);
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
    public ApiResponse<Void> delete(@PathVariable Long id, Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        monitoringService.delete(id, currentUser);
        return new ApiResponse<Void>(
                true,
                null,
                "done",
                null,
                LocalDateTime.now()
        );
    }

    // MANUAL HEALTH CHECK --------------------
    @PostMapping("/{id}/check")
    public ApiResponse<HealthCheckLogMapper> check(@PathVariable Long id) {
        HealthCheckLogMapper response = healthCheckService.performHealthCheck(id);

        return new ApiResponse<>(
                true,
                response,
                "done",
                null,
                LocalDateTime.now()
        );
    }

    // ENABLE / DISABLE AUTO CHECK FOR ONE SERVICE --------
    @PutMapping("/{id}/autocheck")
    public ApiResponse<HealthCheckLogMapper> toggleAutoCheck(@PathVariable Long id,
            @RequestBody AutoCheckRequest request){
                try {
                    monitoringService.enableAutoCheck(id, request.isEnabled(), request.getIntervalMinutes());

                    return new ApiResponse<>(
                        true, 
                        null, 
                        "done",
                        null, 
                        LocalDateTime.now()
                        );
                
                }catch (Exception e) {
                    return new ApiResponse<>(
                        false,
                        null,
                        "server_error",
                        e.getMessage(),
                        LocalDateTime.now()
                    );
            }

        }

    
    @GetMapping("/dashboard/metrics")
    public ApiResponse<DashbaordMetricsDTO> getMetrics(Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            DashbaordMetricsDTO metrics = monitoringService.getDashbaordMetrics(currentUser);
            
            return new ApiResponse<>(
                true,
                metrics,
                "done",
                null,
                LocalDateTime.now()
            );
        } catch (Exception e) {
            return new ApiResponse<>(
                false,
                null,
                "error",
                null,
                LocalDateTime.now()
            );
        }
    }
    
}
