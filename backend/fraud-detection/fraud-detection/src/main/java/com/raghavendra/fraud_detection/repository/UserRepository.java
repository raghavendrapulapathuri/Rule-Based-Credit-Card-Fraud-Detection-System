package com.raghavendra.fraud_detection.repository;

import com.raghavendra.fraud_detection.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {

    // Find customer using email
    Optional<User> findByEmail(String email);

    // Find customer using mobile number
    Optional<User> findByPhoneNumber(String phoneNumber);

    // Check whether email already exists
    boolean existsByEmail(String email);

    // Check whether mobile number already exists
    boolean existsByPhoneNumber(String phoneNumber);
}