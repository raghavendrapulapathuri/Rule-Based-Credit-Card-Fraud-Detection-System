package com.raghavendra.fraud_detection.repository;

import com.raghavendra.fraud_detection.entity.SupportTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupportTicketRepository
        extends JpaRepository<SupportTicket, Long> {

}