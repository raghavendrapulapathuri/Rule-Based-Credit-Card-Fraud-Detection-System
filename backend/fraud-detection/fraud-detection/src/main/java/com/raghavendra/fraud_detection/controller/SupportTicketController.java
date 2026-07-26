package com.raghavendra.fraud_detection.controller;

import com.raghavendra.fraud_detection.entity.SupportTicket;
import com.raghavendra.fraud_detection.repository.SupportTicketRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/support-tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class SupportTicketController {

    private final SupportTicketRepository supportTicketRepository;

    public SupportTicketController(
            SupportTicketRepository supportTicketRepository) {
        this.supportTicketRepository = supportTicketRepository;
    }

    // ==========================================
    // GET ALL SUPPORT TICKETS
    // ==========================================

    @GetMapping
    public List<SupportTicket> getAllTickets() {
        return supportTicketRepository.findAll();
    }

    // ==========================================
    // CREATE SUPPORT TICKET
    // ==========================================

    @PostMapping
    public ResponseEntity<SupportTicket> createTicket(
            @RequestBody SupportTicket supportTicket) {

        supportTicket.setId(null);

        if (supportTicket.getStatus() == null ||
                supportTicket.getStatus().isBlank()) {

            supportTicket.setStatus("OPEN");
        }

        SupportTicket savedTicket =
                supportTicketRepository.save(supportTicket);

        return ResponseEntity.ok(savedTicket);
    }

    // ==========================================
    // GET SUPPORT TICKET BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<SupportTicket> getTicketById(
            @PathVariable Long id) {

        Optional<SupportTicket> ticket =
                supportTicketRepository.findById(id);

        if (ticket.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(ticket.get());
    }

    // ==========================================
    // RESOLVE SUPPORT TICKET
    // ==========================================

    @PutMapping("/{id}/resolve")
    public ResponseEntity<SupportTicket> resolveTicket(
            @PathVariable Long id) {

        Optional<SupportTicket> optionalTicket =
                supportTicketRepository.findById(id);

        if (optionalTicket.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        SupportTicket ticket = optionalTicket.get();

        ticket.setStatus("RESOLVED");

        SupportTicket updatedTicket =
                supportTicketRepository.save(ticket);

        return ResponseEntity.ok(updatedTicket);
    }
}