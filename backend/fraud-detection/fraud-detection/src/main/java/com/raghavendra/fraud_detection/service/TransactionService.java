package com.raghavendra.fraud_detection.service;

import com.raghavendra.fraud_detection.entity.Transaction;
import com.raghavendra.fraud_detection.repository.TransactionRepository;
import com.raghavendra.fraud_detection.rules.BlacklistedMerchantRule;
import com.raghavendra.fraud_detection.rules.HighAmountRule;
import com.raghavendra.fraud_detection.rules.MidnightTransactionRule;
import com.raghavendra.fraud_detection.rules.MultipleTransactionRule;
import com.raghavendra.fraud_detection.rules.SuspiciousLocationRule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private HighAmountRule highAmountRule;

    @Autowired
    private MidnightTransactionRule midnightTransactionRule;

    @Autowired
    private BlacklistedMerchantRule blacklistedMerchantRule;

    @Autowired
    private SuspiciousLocationRule suspiciousLocationRule;

    @Autowired
    private MultipleTransactionRule multipleTransactionRule;

    public Transaction saveTransaction(Transaction transaction) {

        if (transaction.getTransactionTime() == null) {
            transaction.setTransactionTime(LocalDateTime.now());
        }

        int fraudScore = 0;

        fraudScore += highAmountRule.getScore(transaction);
        fraudScore += midnightTransactionRule.getScore(transaction);
        fraudScore += blacklistedMerchantRule.getScore(transaction);
        fraudScore += suspiciousLocationRule.getScore(transaction);
        fraudScore += multipleTransactionRule.getScore(transaction);

        transaction.setFraudScore(fraudScore);

        if (fraudScore >= 60) {
            transaction.setStatus("FRAUD");
        } else if (fraudScore >= 30) {
            transaction.setStatus("SUSPICIOUS");
        } else {
            transaction.setStatus("SAFE");
        }

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
}