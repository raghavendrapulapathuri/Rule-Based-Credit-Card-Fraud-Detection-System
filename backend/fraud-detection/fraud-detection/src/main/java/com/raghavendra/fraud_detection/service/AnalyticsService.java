package com.raghavendra.fraud_detection.service;

import com.raghavendra.fraud_detection.dto.AnalyticsResponse;
import com.raghavendra.fraud_detection.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    @Autowired
    private TransactionRepository transactionRepository;

    public AnalyticsResponse getFraudAnalytics() {

        long total = transactionRepository.count();
        long fraud = transactionRepository.countByStatus("FRAUD");

        double percentage = 0;

        if (total > 0) {
            percentage = (fraud * 100.0) / total;
        }

        AnalyticsResponse response = new AnalyticsResponse();
        response.setTotalTransactions(total);
        response.setFraudTransactions(fraud);
        response.setFraudPercentage(Math.round(percentage * 100.0) / 100.0);

        return response;
    }

    public Double getFraudAmount() {
        return transactionRepository.getTotalFraudAmount();
    }
}