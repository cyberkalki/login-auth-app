package com.login_auth_app.service;

import com.login_auth_app.entity.LoginAttempt;
import com.login_auth_app.entity.User;
import com.login_auth_app.repository.LoginAttemptRepository;
import com.login_auth_app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class LoginAttemptService {
    private final LoginAttemptRepository attemptRepo;
    private final UserRepository userRepo;

    @Value("${auth.max-login-attempts:5}")
    private int maxAttempts;

    public LoginAttemptService(LoginAttemptRepository attemptRepo, UserRepository userRepo){
        this.attemptRepo = attemptRepo;
        this.userRepo = userRepo;
    }

    public void recordFailedAttempt(String username) {
        LoginAttempt attempt = attemptRepo.findByUsername(username).orElseGet(() -> {
            LoginAttempt la = new LoginAttempt();
            la.setUsername(username);
            la.setAttempts(0);
            return la;
        });
        attempt.setAttempts(attempt.getAttempts() + 1);
        attempt.setLastAttempt(LocalDateTime.now());
        attemptRepo.save(attempt);

        if (attempt.getAttempts() >= maxAttempts) {
            userRepo.findByUsername(username).ifPresent(u -> {
                u.setAccountNonLocked(false);
                u.setLockedAt(LocalDateTime.now());
                userRepo.save(u);
            });
        }
    }

    public void resetAttempts(String username) {
        attemptRepo.findByUsername(username).ifPresent(attempt -> {
            attempt.setAttempts(0);
            attempt.setLastAttempt(LocalDateTime.now());
            attemptRepo.save(attempt);
        });
    }

    public boolean isAccountLocked(String username) {
        return userRepo.findByUsername(username).map(u -> !u.isAccountNonLocked()).orElse(false);
    }
}
