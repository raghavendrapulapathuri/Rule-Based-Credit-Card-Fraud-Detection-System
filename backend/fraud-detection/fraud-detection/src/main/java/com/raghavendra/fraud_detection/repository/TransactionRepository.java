package com.raghavendra.fraud_detection.repository;

import com.raghavendra.fraud_detection.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}