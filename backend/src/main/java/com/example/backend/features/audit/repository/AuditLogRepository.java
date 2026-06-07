package com.example.backend.features.audit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.features.audit.model.AuditLogModel;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogModel, Long> {

    List<AuditLogModel> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<AuditLogModel> findByActionOrderByCreatedAtDesc(String action);
}
