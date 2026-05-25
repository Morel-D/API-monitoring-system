package com.example.backend.features.HealthCheckLog.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.features.HealthCheckLog.model.HealthCheckLogModel;

@Repository
public interface HealthCheckRepository extends JpaRepository<HealthCheckLogModel, Long> {

}
