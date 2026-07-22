package com.raghavendra.fraud_detection.controller;

import com.raghavendra.fraud_detection.entity.Transaction;
import com.raghavendra.fraud_detection.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public Transaction saveTransaction(@Valid @RequestBody Transaction transaction) {
        return transactionService.saveTransaction(transaction);
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/status/{status}")
    public List<Transaction> getTransactionsByStatus(@PathVariable String status) {
        return transactionService.getTransactionsByStatus(status);
    }

    @GetMapping("/merchant/{merchant}")
    public List<Transaction> getTransactionsByMerchant(@PathVariable String merchant) {
        return transactionService.getTransactionsByMerchant(merchant);
    }

    @GetMapping("/location/{location}")
    public List<Transaction> getTransactionsByLocation(@PathVariable String location) {
        return transactionService.getTransactionsByLocation(location);
    }

    @GetMapping("/fraud")
    public List<Transaction> getFraudTransactions() {
        return transactionService.getFraudTransactions();
    }
}