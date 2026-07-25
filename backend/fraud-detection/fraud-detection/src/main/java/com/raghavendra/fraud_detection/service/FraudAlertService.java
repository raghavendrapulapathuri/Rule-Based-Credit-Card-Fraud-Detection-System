package com.raghavendra.fraud_detection.service;

import com.raghavendra.fraud_detection.entity.FraudAlert;
import com.raghavendra.fraud_detection.entity.Transaction;
import com.raghavendra.fraud_detection.exception.ResourceNotFoundException;
import com.raghavendra.fraud_detection.repository.FraudAlertRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FraudAlertService {

    @Autowired
    private FraudAlertRepository fraudAlertRepository;

    // Create alert automatically when a suspicious/fraud transaction occurs
    public void createAlert(Transaction transaction) {

        FraudAlert alert = new FraudAlert();

        alert.setTransaction(transaction);
        alert.setStatus(transaction.getStatus());
        alert.setAlertTime(LocalDateTime.now());

        if ("FRAUD".equals(transaction.getStatus())) {
            alert.setMessage("High-risk transaction detected.");
        } else {
            alert.setMessage("Suspicious transaction detected.");
        }

        fraudAlertRepository.save(alert);
    }

    // Get all fraud alerts
    public List<FraudAlert> getAllAlerts() {
        return fraudAlertRepository.findAll();
    }

    // Get one fraud alert by ID
    public FraudAlert getAlertById(Long id) {

        return fraudAlertRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Fraud alert not found with ID: " + id
                        )
                );
    }

    // Mark an alert as resolved
    public FraudAlert resolveAlert(Long id) {

        FraudAlert alert = fraudAlertRepository
                .findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Fraud alert not found with ID: " + id
                        )
                );

        alert.setStatus("RESOLVED");

        return fraudAlertRepository.save(alert);
    }
}