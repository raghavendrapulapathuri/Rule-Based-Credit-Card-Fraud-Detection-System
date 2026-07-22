package com.raghavendra.fraud_detection.service;

import com.raghavendra.fraud_detection.entity.Transaction;
import com.raghavendra.fraud_detection.exception.ResourceNotFoundException;
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

    @Autowired
    private FraudAlertService fraudAlertService;

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

        Transaction savedTransaction = transactionRepository.save(transaction);

        if (!"SAFE".equals(savedTransaction.getStatus())) {
            fraudAlertService.createAlert(savedTransaction);
        }

        return savedTransaction;
    }

    // Get all transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Search by Status
    public List<Transaction> getTransactionsByStatus(String status) {

        List<Transaction> transactions = transactionRepository.findByStatus(status);

        if (transactions.isEmpty()) {
            throw new ResourceNotFoundException("No transactions found with status: " + status);
        }

        return transactions;
    }

    // Search by Merchant
    public List<Transaction> getTransactionsByMerchant(String merchant) {

        List<Transaction> transactions = transactionRepository.findByMerchant(merchant);

        if (transactions.isEmpty()) {
            throw new ResourceNotFoundException("No transactions found for merchant: " + merchant);
        }

        return transactions;
    }

    // Search by Location
    public List<Transaction> getTransactionsByLocation(String location) {

        List<Transaction> transactions = transactionRepository.findByLocation(location);

        if (transactions.isEmpty()) {
            throw new ResourceNotFoundException("No transactions found for location: " + location);
        }

        return transactions;
    }

    // Get Fraud Transactions
    public List<Transaction> getFraudTransactions() {

        List<Transaction> transactions = transactionRepository.findByStatus("FRAUD");

        if (transactions.isEmpty()) {
            throw new ResourceNotFoundException("No fraud transactions found.");
        }

        return transactions;
    }
}