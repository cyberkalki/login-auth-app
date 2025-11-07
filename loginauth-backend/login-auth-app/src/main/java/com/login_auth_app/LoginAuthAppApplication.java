package com.login_auth_app;

import com.login_auth_app.entity.Role;
import com.login_auth_app.entity.User;
import com.login_auth_app.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@SpringBootApplication
public class LoginAuthAppApplication {
    public static void main(String[] args) {
        SpringApplication.run(LoginAuthAppApplication.class, args);
    }

//    // password encoder bean
//    @Bean
//    public PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }

    // Seed default admin on startup if not exists
    @Bean
    public CommandLineRunner seedAdmin(UserService userService, PasswordEncoder encoder) {
        return args -> {
            String adminUsername = "admin";
            if (userService.findByUsername(adminUsername).isEmpty()) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setPassword(encoder.encode("admin123")); // change later
                admin.setEnabled(true);
                admin.setAccountNonLocked(true);
                admin.setRoles(Set.of(Role.ROLE_ADMIN));
                userService.save(admin);
                System.out.println("Default admin created -> username=admin password=admin123");
            } else {
                System.out.println("Admin user exists; no seeding performed.");
            }
        };
    }
}
