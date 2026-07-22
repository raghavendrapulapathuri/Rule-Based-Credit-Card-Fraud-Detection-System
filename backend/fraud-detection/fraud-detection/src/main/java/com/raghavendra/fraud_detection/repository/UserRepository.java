package com.raghavendra.fraud_detection.repository;

import com.raghavendra.fraud_detection.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

}