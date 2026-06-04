package com.example.backend.features.monitoring.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.backend.features.monitoring.model.MonitoringModel;
import com.example.backend.security.model.User;

@Repository
public interface MonitoringRepository extends JpaRepository<MonitoringModel, Long> {

    @Query("SELECT m FROM MonitoringModel m " +
           "WHERE m.autoCheckEnabled = true " +
           "AND (m.lastCheckedAt IS NULL OR " +
           "     m.lastCheckedAt < :nowMinusInterval)")
    List<MonitoringModel> findServicesDueForCheck(@Param("nowMinusInterval") LocalDateTime nowMinusInterval);


    // Helper default method
    default List<MonitoringModel> findServicesDueForCheck() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(1); 
        return findServicesDueForCheck(threshold);
    }


    List<MonitoringModel> findByUser(User user);

    // For extra security (recommended)
    Optional<MonitoringModel> findByIdAndUser(Long id, User user);
}
