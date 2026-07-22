package com.raghavendra.fraud_detection.rules;

import com.raghavendra.fraud_detection.entity.Transaction;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class SuspiciousLocationRule {

    private static final Set<String> SUSPICIOUS_LOCATIONS = Set.of(
            "Unknown",
            "DarkWeb",
            "Offshore",
            "ForeignCountry"
    );

    public int getScore(Transaction transaction) {

        if (transaction.getLocation() != null &&
                SUSPICIOUS_LOCATIONS.contains(transaction.getLocation())) {
            return 30;
        }

        return 0;
    }
}