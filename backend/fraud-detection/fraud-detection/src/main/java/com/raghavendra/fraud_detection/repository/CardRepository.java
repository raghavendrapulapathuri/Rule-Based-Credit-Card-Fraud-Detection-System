package com.raghavendra.fraud_detection.repository;

import com.raghavendra.fraud_detection.entity.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card, Long> {

}