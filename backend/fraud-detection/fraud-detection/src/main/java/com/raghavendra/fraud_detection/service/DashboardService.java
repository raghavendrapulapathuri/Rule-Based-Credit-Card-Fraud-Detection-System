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

        response.setTotalTransactions(transactionRepository.count());
        response.setSafeTransactions(transactionRepository.countByStatus("SAFE"));
        response.setSuspiciousTransactions(transactionRepository.countByStatus("SUSPICIOUS"));
        response.setFraudTransactions(transactionRepository.countByStatus("FRAUD"));
        response.setTotalAlerts(fraudAlertRepository.count());

        return response;
    }
}