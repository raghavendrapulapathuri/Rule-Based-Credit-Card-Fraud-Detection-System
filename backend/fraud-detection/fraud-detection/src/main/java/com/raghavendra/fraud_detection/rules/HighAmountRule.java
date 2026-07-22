package com.raghavendra.fraud_detection.rules;

import com.raghavendra.fraud_detection.entity.Transaction;
import org.springframework.stereotype.Component;

@Component
public class HighAmountRule {

    private static final double LIMIT = 50000;

    // Returns score instead of true/false
    public int getScore(Transaction transaction) {

        if (transaction.getAmount() > LIMIT) {
            return 40;
        }

        return 0;
    }
}