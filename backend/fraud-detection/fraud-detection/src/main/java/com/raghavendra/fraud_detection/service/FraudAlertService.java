package com.raghavendra.fraud_detection.service;

import com.raghavendra.fraud_detection.entity.FraudAlert;
import com.raghavendra.fraud_detection.entity.Transaction;
import com.raghavendra.fraud_detection.repository.FraudAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class FraudAlertService {

    @Autowired
    private FraudAlertRepository fraudAlertRepository;

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
}