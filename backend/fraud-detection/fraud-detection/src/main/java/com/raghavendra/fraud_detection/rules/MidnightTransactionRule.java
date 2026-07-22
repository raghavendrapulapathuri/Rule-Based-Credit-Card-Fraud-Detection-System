package com.raghavendra.fraud_detection.rules;

import com.raghavendra.fraud_detection.entity.Transaction;
import org.springframework.stereotype.Component;

@Component
public class MidnightTransactionRule {

    public int getScore(Transaction transaction) {

        int hour = transaction.getTransactionTime().getHour();

        if (hour >= 0 && hour < 4) {
            return 20;
        }

        return 0;
    }
}