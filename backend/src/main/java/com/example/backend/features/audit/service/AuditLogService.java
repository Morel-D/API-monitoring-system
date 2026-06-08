package com.example.backend.features.audit.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.backend.features.audit.model.AuditLogModel;
import com.example.backend.features.audit.repository.AuditLogRepository;
import com.example.backend.security.model.User;
import com.example.backend.shared.enums.AuditAction;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(User user, AuditAction action, String entityType, Long entityId, String description) {
        AuditLogModel log = new AuditLogModel();
        log.setUser(user);
        log.setAction(action.name());
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDescription(description);

        auditLogRepository.save(log);
    }

    public void logAction(User user, AuditAction action, String entityType, Long entityId) {
        logAction(user, action, entityType, entityId, null);
    }


    //GET LOGS FOR CURRENT USER 
    public Page<AuditLogModel> getLogsByCurrentUser(User currentUser, Pageable pageable) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId(), pageable);
    }

    // Get recent logs (e.g., last 50)
    public Page<AuditLogModel> getRecentLogsByUser(User currentUser, int limit) {
        if (limit <= 0) limit = 20;
        
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId(), pageable);
    }

}
