package com.login_auth_app.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String action; // LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT
//    private String ip;
    private LocalDateTime timestamp;
    @Column(columnDefinition = "text")
    private String details;

    public AuditLog() {
        this.timestamp = LocalDateTime.now();
    }
    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
//    public String getIp() { return ip; }
//    public void setIp(String ip) { this.ip = ip; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
