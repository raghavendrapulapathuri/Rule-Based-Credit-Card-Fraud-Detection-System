package com.raghavendra.fraud_detection.controller;

import com.raghavendra.fraud_detection.entity.FraudAlert;
import com.raghavendra.fraud_detection.repository.FraudAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
public class FraudAlertController {

    @Autowired
    private FraudAlertRepository fraudAlertRepository;

    @GetMapping
    public List<FraudAlert> getAllAlerts() {
        return fraudAlertRepository.findAll();
    }

    @GetMapping("/{id}")
    public FraudAlert getAlertById(@PathVariable Long id) {
        return fraudAlertRepository.findById(id).orElse(null);
    }
}