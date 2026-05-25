package com.example.backend.features.monitoring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.features.monitoring.model.MonitoringModel;

@Repository
public interface MonitoringRepository extends JpaRepository<MonitoringModel, Long> {

}
