package com.raghavendra.fraud_detection.repository;

import com.raghavendra.fraud_detection.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    long countByStatus(String status);

    List<Transaction> findByStatus(String status);

    List<Transaction> findByMerchant(String merchant);

    List<Transaction> findByLocation(String location);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.status = 'FRAUD'")
    Double getTotalFraudAmount();
}