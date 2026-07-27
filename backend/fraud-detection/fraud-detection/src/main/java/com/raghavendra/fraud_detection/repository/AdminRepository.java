package com.raghavendra.fraud_detection.repository;

import com.raghavendra.fraud_detection.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository
        extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);
}