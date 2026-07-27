package com.raghavendra.fraud_detection.controller;

import com.raghavendra.fraud_detection.entity.Admin;
import com.raghavendra.fraud_detection.repository.AdminRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminRepository adminRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public AdminController(
            AdminRepository adminRepository
    ) {
        this.adminRepository = adminRepository;
    }

    // =====================================================
    // ADMIN LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> loginRequest
    ) {

        String email =
                loginRequest.get("email");

        String password =
                loginRequest.get("password");

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (
                email == null ||
                email.trim().isEmpty() ||
                password == null ||
                password.trim().isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Email and password are required."
                            )
                    );
        }

        // -------------------------------------------------
        // FIND ADMIN
        // -------------------------------------------------

        Optional<Admin> optionalAdmin =
                adminRepository.findByEmail(
                        email.trim()
                );

        if (optionalAdmin.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email or password."
                            )
                    );
        }

        Admin admin =
                optionalAdmin.get();

        String storedPassword =
                admin.getPassword();

        boolean passwordMatches = false;

        // -------------------------------------------------
        // CHECK IF PASSWORD IS ALREADY BCRYPT
        // -------------------------------------------------

        boolean bcryptPassword =
                storedPassword != null &&
                (
                        storedPassword.startsWith("$2a$") ||
                        storedPassword.startsWith("$2b$") ||
                        storedPassword.startsWith("$2y$")
                );

        // -------------------------------------------------
        // VERIFY PASSWORD
        // -------------------------------------------------

        if (bcryptPassword) {

            passwordMatches =
                    passwordEncoder.matches(
                            password,
                            storedPassword
                    );

        } else {

            // Temporary migration support for the
            // existing plain-text password.

            passwordMatches =
                    storedPassword != null &&
                    storedPassword.equals(password);

            // If plain-text login succeeds,
            // immediately convert password to BCrypt.

            if (passwordMatches) {

                admin.setPassword(
                        passwordEncoder.encode(
                                password
                        )
                );

                adminRepository.save(admin);

                System.out.println(
                        "Admin password migrated to BCrypt."
                );
            }
        }

        // -------------------------------------------------
        // INVALID PASSWORD
        // -------------------------------------------------

        if (!passwordMatches) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email or password."
                            )
                    );
        }

        // -------------------------------------------------
        // SUCCESS RESPONSE
        // -------------------------------------------------

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "message",
                "Login successful"
        );

        response.put(
                "id",
                admin.getId()
        );

        response.put(
                "name",
                admin.getName()
        );

        response.put(
                "email",
                admin.getEmail()
        );

        response.put(
                "role",
                admin.getRole()
        );

        return ResponseEntity.ok(response);
    }

    // =====================================================
    // CHANGE ADMIN PASSWORD
    // =====================================================

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> request
    ) {

        String email =
                request.get("email");

        String currentPassword =
                request.get("currentPassword");

        String newPassword =
                request.get("newPassword");

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (
                email == null ||
                email.trim().isEmpty() ||
                currentPassword == null ||
                currentPassword.trim().isEmpty() ||
                newPassword == null ||
                newPassword.trim().isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "All password fields are required."
                            )
                    );
        }

        if (newPassword.length() < 8) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "New password must contain at least 8 characters."
                            )
                    );
        }

        // -------------------------------------------------
        // FIND ADMIN
        // -------------------------------------------------

        Optional<Admin> optionalAdmin =
                adminRepository.findByEmail(
                        email.trim()
                );

        if (optionalAdmin.isEmpty()) {

            return ResponseEntity
                    .status(404)
                    .body(
                            Map.of(
                                    "message",
                                    "Administrator not found."
                            )
                    );
        }

        Admin admin =
                optionalAdmin.get();

        String storedPassword =
                admin.getPassword();

        // -------------------------------------------------
        // VERIFY CURRENT PASSWORD
        // -------------------------------------------------

        boolean bcryptPassword =
                storedPassword != null &&
                (
                        storedPassword.startsWith("$2a$") ||
                        storedPassword.startsWith("$2b$") ||
                        storedPassword.startsWith("$2y$")
                );

        boolean currentPasswordMatches;

        if (bcryptPassword) {

            currentPasswordMatches =
                    passwordEncoder.matches(
                            currentPassword,
                            storedPassword
                    );

        } else {

            currentPasswordMatches =
                    storedPassword != null &&
                    storedPassword.equals(
                            currentPassword
                    );
        }

        if (!currentPasswordMatches) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Current password is incorrect."
                            )
                    );
        }

        // -------------------------------------------------
        // PREVENT SAME PASSWORD
        // -------------------------------------------------

        if (bcryptPassword) {

            if (
                    passwordEncoder.matches(
                            newPassword,
                            storedPassword
                    )
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "message",
                                        "New password must be different from the current password."
                                )
                        );
            }

        } else if (
                newPassword.equals(storedPassword)
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "New password must be different from the current password."
                            )
                    );
        }

        // -------------------------------------------------
        // HASH + SAVE NEW PASSWORD
        // -------------------------------------------------

        String encodedPassword =
                passwordEncoder.encode(
                        newPassword
                );

        admin.setPassword(
                encodedPassword
        );

        adminRepository.save(admin);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Password changed successfully."
                )
        );
    }
}