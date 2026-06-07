package com.example.backend.features.audit.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.features.audit.model.AuditLogModel;
import com.example.backend.features.audit.service.AuditLogService;
import com.example.backend.shared.api.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;


    @GetMapping
    public ApiResponse<List<AuditLogModel>> getMyAuditLogs(Authentication authentication) {
        var currentUser = (com.example.backend.security.model.User) authentication.getPrincipal();

        List<AuditLogModel> logs = auditLogService.getLogsByCurrentUser(currentUser);

        return new ApiResponse<>(
            true,
            logs,
            "done",
            null,
            LocalDateTime.now()
        );
    }


    @GetMapping("/recent")
    public ApiResponse<List<AuditLogModel>> getRecentAuditLogs(
            Authentication authentication,
            @RequestParam(defaultValue = "50") int limit) {

        var currentUser = (com.example.backend.security.model.User) authentication.getPrincipal();

        List<AuditLogModel> logs = auditLogService.getRecentLogsByUser(currentUser, limit);

        return new ApiResponse<>(
            true,
            logs,
            "done",
            null,
            LocalDateTime.now()
        );
    }
}
