package com.login_auth_app.controller;

import com.login_auth_app.entity.AuditLog;
import com.login_auth_app.repository.AuditRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/audit")
@CrossOrigin(origins = "*")
public class AuditController {

    private final AuditRepository repo;

    public AuditController(AuditRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {
        List<AuditLog> logs = repo.findAll();
        return ResponseEntity.ok(logs);
    }
}
