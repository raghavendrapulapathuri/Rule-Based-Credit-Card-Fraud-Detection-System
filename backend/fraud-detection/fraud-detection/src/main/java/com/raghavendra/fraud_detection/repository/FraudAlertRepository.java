package com.raghavendra.fraud_detection.repository;

import com.raghavendra.fraud_detection.entity.FraudAlert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {
}