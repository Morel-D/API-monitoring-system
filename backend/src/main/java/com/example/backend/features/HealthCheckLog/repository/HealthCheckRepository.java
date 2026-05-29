package com.example.backend.features.HealthCheckLog.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.features.HealthCheckLog.model.HealthCheckLogModel;

@Repository
public interface HealthCheckRepository extends JpaRepository<HealthCheckLogModel, Long> {

    // This is the correct way to query by the related MonitoringModel's ID
    List<HealthCheckLogModel> findByMonitoringId(Long monitoringId);

    // Get latest checks first
    List<HealthCheckLogModel> findByMonitoringIdOrderByCheckedAtDesc(Long monitoringId);

}
