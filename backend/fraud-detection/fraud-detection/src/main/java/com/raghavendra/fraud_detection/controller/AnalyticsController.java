package com.raghavendra.fraud_detection.controller;

import com.raghavendra.fraud_detection.dto.AnalyticsResponse;
import com.raghavendra.fraud_detection.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/fraud-percentage")
    public AnalyticsResponse getFraudAnalytics() {
        return analyticsService.getFraudAnalytics();
    }

    @GetMapping("/fraud-amount")
    public Double getFraudAmount() {
        return analyticsService.getFraudAmount();
    }
}