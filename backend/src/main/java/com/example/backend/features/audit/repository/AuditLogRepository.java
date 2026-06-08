package com.example.backend.features.audit.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.backend.features.audit.model.AuditLogModel;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLogModel, Long> {

    Page<AuditLogModel> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<AuditLogModel> findByActionOrderByCreatedAtDesc(String action, Pageable pageable);
}
