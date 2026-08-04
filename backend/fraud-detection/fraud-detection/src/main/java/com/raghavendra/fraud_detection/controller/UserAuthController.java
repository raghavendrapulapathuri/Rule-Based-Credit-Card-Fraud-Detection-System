package com.raghavendra.fraud_detection.controller;

import com.raghavendra.fraud_detection.entity.User;
import com.raghavendra.fraud_detection.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserAuthController {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserAuthController(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    // =====================================================
    // CUSTOMER REGISTRATION
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> request
    ) {

        String fullName = request.get("fullName");
        String email = request.get("email");
        String phoneNumber = request.get("phoneNumber");
        String password = request.get("password");
        String confirmPassword = request.get("confirmPassword");

        if (
                fullName == null ||
                fullName.trim().isEmpty() ||
                email == null ||
                email.trim().isEmpty() ||
                phoneNumber == null ||
                phoneNumber.trim().isEmpty() ||
                password == null ||
                password.isEmpty() ||
                confirmPassword == null ||
                confirmPassword.isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "All fields are required."
                            )
                    );
        }

        fullName = fullName.trim();
        email = email.trim().toLowerCase();
        phoneNumber = phoneNumber.trim();

        // ==============================
        // VALIDATION
        // ==============================

        if (
                fullName.length() < 2 ||
                fullName.length() > 100
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Full name must be between 2 and 100 characters."
                            )
                    );
        }

        if (
                !email.matches(
                        "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
                )
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Please enter a valid email address."
                            )
                    );
        }

        if (!phoneNumber.matches("^[0-9]{10}$")) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Phone number must contain exactly 10 digits."
                            )
                    );
        }

        if (password.length() < 8) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Password must contain at least 8 characters."
                            )
                    );
        }

        if (!password.equals(confirmPassword)) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Password and Confirm Password do not match."
                            )
                    );
        }

        // ==============================
        // DUPLICATE CHECK
        // ==============================

        if (userRepository.existsByEmail(email)) {

            return ResponseEntity
                    .status(409)
                    .body(
                            Map.of(
                                    "message",
                                    "Email already exists."
                            )
                    );
        }

        if (
                userRepository.existsByPhoneNumber(
                        phoneNumber
                )
        ) {

            return ResponseEntity
                    .status(409)
                    .body(
                            Map.of(
                                    "message",
                                    "Phone number already exists."
                            )
                    );
        }

        // ==============================
        // SAVE USER
        // ==============================

        User user = new User();

        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);

        user.setPassword(
                passwordEncoder.encode(password)
        );

        User savedUser =
                userRepository.save(user);

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "message",
                "Account created successfully."
        );

        response.put(
                "id",
                savedUser.getId()
        );

        response.put(
                "fullName",
                savedUser.getFullName()
        );

        response.put(
                "email",
                savedUser.getEmail()
        );

        response.put(
                "phoneNumber",
                savedUser.getPhoneNumber()
        );

        return ResponseEntity
                .status(201)
                .body(response);
    }

    // =====================================================
    // CUSTOMER LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody Map<String, String> request
    ) {

        String username =
                request.get("username");

        String password =
                request.get("password");

        if (
                username == null ||
                username.trim().isEmpty() ||
                password == null ||
                password.trim().isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    "Username and password are required."
                            )
                    );
        }

        username = username.trim();

        User user;

        if (username.contains("@")) {

            user = userRepository
                    .findByEmail(username)
                    .orElse(null);

        } else {

            user = userRepository
                    .findByPhoneNumber(username)
                    .orElse(null);
        }

        if (user == null) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email/mobile or password."
                            )
                    );
        }

        if (
                !passwordEncoder.matches(
                        password,
                        user.getPassword()
                )
        ) {

            return ResponseEntity
                    .status(401)
                    .body(
                            Map.of(
                                    "message",
                                    "Invalid email/mobile or password."
                            )
                    );
        }

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "message",
                "Login successful"
        );

        response.put(
                "id",
                user.getId()
        );

        response.put(
                "fullName",
                user.getFullName()
        );

        response.put(
                "email",
                user.getEmail()
        );

        response.put(
                "phoneNumber",
                user.getPhoneNumber()
        );

        return ResponseEntity.ok(response);
    }

}