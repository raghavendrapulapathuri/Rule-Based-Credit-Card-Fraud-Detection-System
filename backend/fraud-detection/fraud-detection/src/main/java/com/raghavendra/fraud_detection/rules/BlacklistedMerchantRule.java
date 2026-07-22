package com.raghavendra.fraud_detection.rules;

import com.raghavendra.fraud_detection.entity.Transaction;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class BlacklistedMerchantRule {

    private static final Set<String> BLACKLIST = Set.of(
            "ScamStore",
            "FraudShop",
            "FakePay",
            "BlackMarket"
    );

    public int getScore(Transaction transaction) {

        if (transaction.getMerchant() != null &&
                BLACKLIST.contains(transaction.getMerchant())) {
            return 30;
        }

        return 0;
    }
}