package com.raghavendra.fraud_detection.service;

import com.raghavendra.fraud_detection.dto.DashboardResponse;
import com.raghavendra.fraud_detection.repository.FraudAlertRepository;
import com.raghavendra.fraud_detection.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private FraudAlertRepository fraudAlertRepository;

    public DashboardResponse getSummary() {

        DashboardResponse response = new DashboardResponse();

        long total = transactionRepository.count();
        long safe = transactionRepository.countByStatus("SAFE");
        long suspicious =
                transactionRepository.countByStatus("SUSPICIOUS");
        long fraud =
                transactionRepository.countByStatus("FRAUD");

        // Count only active/unresolved alerts
        long activeAlerts =
                fraudAlertRepository.countByStatusNot("RESOLVED");

        System.out.println("==================================");
        System.out.println("Total Transactions = " + total);
        System.out.println("Safe Transactions = " + safe);
        System.out.println(
                "Suspicious Transactions = " + suspicious
        );
        System.out.println("Fraud Transactions = " + fraud);
        System.out.println("Active Alerts = " + activeAlerts);
        System.out.println("==================================");

        response.setTotalTransactions(total);
        response.setSafeTransactions(safe);
        response.setSuspiciousTransactions(suspicious);
        response.setFraudTransactions(fraud);
        response.setTotalAlerts(activeAlerts);

        return response;
    }
}