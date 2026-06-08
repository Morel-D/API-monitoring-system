package com.example.backend.features.HealthCheckLog.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.features.HealthCheckLog.model.HealthCheckLogModel;

@Repository
public interface HealthCheckRepository extends JpaRepository<HealthCheckLogModel, Long> {

    // This is the correct way to query by the related MonitoringModel's ID
    Page<HealthCheckLogModel> findByMonitoringId(Long monitoringId, Pageable pageable);

    // Get latest checks first
    Page<HealthCheckLogModel> findByMonitoringIdOrderByCheckedAtDesc(Long monitoringId, Pageable pageable);

    @Query("SELECT h FROM HealthCheckLogModel h WHERE h.checkedAt = (" +
       "    SELECT MAX(h2.checkedAt) FROM HealthCheckLogModel h2 " +
       "    WHERE h2.monitoring.id = h.monitoring.id" +
       ")")
    List<HealthCheckLogModel> findLatestCheckPerService();


    // Get latest check for a specific service
    Optional<HealthCheckLogModel> findTopByMonitoringIdOrderByCheckedAtDesc(Long monitoringId);


    

}
