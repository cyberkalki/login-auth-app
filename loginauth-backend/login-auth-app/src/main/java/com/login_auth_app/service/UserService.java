package com.login_auth_app.service;

import com.login_auth_app.entity.User;
import com.login_auth_app.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;
    private final AuditService auditService;

    public UserService(UserRepository repo, AuditService auditService) {
        this.repo = repo;
        this.auditService = auditService;
    }

    // 🔍 Find user by username
    public Optional<User> findByUsername(String username) {
        return repo.findByUsername(username);
    }

    // 💾 Save user (used for registration)
    public User save(User user) {
        return repo.save(user);
    }

    // 📋 Get all users (for admin)
    public List<User> findAll() {
        return repo.findAll();
    }

    // 🚫 Enable/Disable user
    public User toggleEnabled(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(!user.isEnabled());
        User updated = repo.save(user);

        String admin = getCurrentAdmin();
        auditService.log(admin, "ADMIN_TOGGLE_USER",
                "Admin toggled user '" + user.getUsername() + "' to " +
                        (user.isEnabled() ? "ENABLED" : "DISABLED"));

        return updated;
    }

    // 🔓 Unlock a locked user
    public User unlockUser(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setAccountNonLocked(true);
        user.setLockedAt(null);
        User updated = repo.save(user);

        String admin = getCurrentAdmin();
        auditService.log(admin, "ADMIN_UNLOCK_USER",
                "Admin unlocked user '" + user.getUsername() + "'");

        return updated;
    }

    // 🗑️ Delete user
    public void deleteUser(Long id) {
        User user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        repo.delete(user);

        String admin = getCurrentAdmin();
        auditService.log(admin, "ADMIN_DELETE_USER",
                "Admin deleted user '" + user.getUsername() + "'");
    }

    // 🧠 Helper: Get the current logged-in admin’s username
    private String getCurrentAdmin() {
        try {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        } catch (Exception e) {
            return "unknown";
        }
    }
}
