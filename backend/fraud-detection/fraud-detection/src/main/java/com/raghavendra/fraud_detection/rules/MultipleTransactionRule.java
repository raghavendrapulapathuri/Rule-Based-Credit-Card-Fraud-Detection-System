package com.raghavendra.fraud_detection.rules;

import com.raghavendra.fraud_detection.entity.Transaction;
import com.raghavendra.fraud_detection.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class MultipleTransactionRule {

    @Autowired
    private TransactionRepository transactionRepository;

    public int getScore(Transaction transaction) {

        int count = 0;

        for (Transaction t : transactionRepository.findAll()) {

            if (t.getCard().getId().equals(transaction.getCard().getId())) {

                long minutes = java.time.Duration.between(
                        t.getTransactionTime(),
                        transaction.getTransactionTime()
                ).abs().toMinutes();

                if (minutes <= 2) {
                    count++;
                }
            }
        }

        if (count >= 2) {
            return 20;
        }

        return 0;
    }
}