package com.example.backend.features.audit.service;


import java.util.List;

import org.hibernate.audit.AuditLog;
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
    public List<AuditLogModel> getLogsByCurrentUser(User currentUser) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    // Get recent logs (e.g., last 50)
    public List<AuditLogModel> getRecentLogsByUser(User currentUser, int limit) {
        List<AuditLogModel> logs = getLogsByCurrentUser(currentUser);
        return logs.stream().limit(limit).toList();
    }

}
