package com.login_auth_app.dto;

public class AuthRequest {
    private String username;
    private String password;
    private String role; // optional: "USER" or "ADMIN"

    public AuthRequest() {}
    // getters/setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
