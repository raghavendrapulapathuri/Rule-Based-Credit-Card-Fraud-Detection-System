package com.raghavendra.fraud_detection.controller;

import com.raghavendra.fraud_detection.entity.FraudAlert;
import com.raghavendra.fraud_detection.service.FraudAlertService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
public class FraudAlertController {

    @Autowired
    private FraudAlertService fraudAlertService;

    // Get all alerts
    @GetMapping
    public List<FraudAlert> getAllAlerts() {
        return fraudAlertService.getAllAlerts();
    }

    // Get alert by ID
    @GetMapping("/{id}")
    public FraudAlert getAlertById(@PathVariable Long id) {
        return fraudAlertService.getAlertById(id);
    }

    // Resolve an alert
    @PutMapping("/{id}/resolve")
    public FraudAlert resolveAlert(@PathVariable Long id) {
        return fraudAlertService.resolveAlert(id);
    }
}