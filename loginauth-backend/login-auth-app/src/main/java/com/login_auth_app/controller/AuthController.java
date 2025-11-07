package com.login_auth_app.controller;

import com.login_auth_app.config.JwtUtil;
import com.login_auth_app.dto.AuthLoginReq;
import com.login_auth_app.dto.AuthRequest;
import com.login_auth_app.dto.AuthResponse;
import com.login_auth_app.entity.Role;
import com.login_auth_app.entity.User;
import com.login_auth_app.service.AuditService;
import com.login_auth_app.service.LoginAttemptService;
import com.login_auth_app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final LoginAttemptService loginAttemptService;
    private final AuditService auditService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserService userService,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            LoginAttemptService loginAttemptService,
            AuditService auditService
    ) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.loginAttemptService = loginAttemptService;
        this.auditService = auditService;
    }

    // 🧾 Register new user
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        if (userService.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));

        String role = (req.getRole() == null) ? "USER" : req.getRole().toUpperCase();
        if (role.equals("ADMIN")) user.getRoles().add(Role.ROLE_ADMIN);
        else user.getRoles().add(Role.ROLE_USER);

        userService.save(user);
        auditService.log(req.getUsername(), "REGISTER", "User registered as " + role);
        return ResponseEntity.ok("Registered successfully as " + role);
    }

    // 🔑 Login endpoint with audit + lock tracking
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthLoginReq req) {
        if (loginAttemptService.isAccountLocked(req.getUsername())) {
            auditService.log(req.getUsername(), "LOGIN_FAIL", "Account locked due to too many attempts");
            return ResponseEntity.status(423).body("Account locked due to failed attempts");
        }

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );
            UserDetails ud = (UserDetails) auth.getPrincipal();
            String token = jwtUtil.generateToken(ud);

            loginAttemptService.resetAttempts(req.getUsername());
            auditService.log(req.getUsername(), "LOGIN_SUCCESS", "User logged in successfully");

            return ResponseEntity.ok(new AuthResponse(token));
        } catch (BadCredentialsException e) {
            loginAttemptService.recordFailedAttempt(req.getUsername());
            auditService.log(req.getUsername(), "LOGIN_FAIL", "Invalid credentials");
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    // 🚪 Logout endpoint
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader(name="Authorization", required = false) String authHeader) {
        String username = "unknown";
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                username = jwtUtil.extractUsername(authHeader.substring(7));
            } catch (Exception ignored) {}
        }

        auditService.log(username, "LOGOUT", "User logged out");
        return ResponseEntity.ok("Logged out successfully");
    }
}
