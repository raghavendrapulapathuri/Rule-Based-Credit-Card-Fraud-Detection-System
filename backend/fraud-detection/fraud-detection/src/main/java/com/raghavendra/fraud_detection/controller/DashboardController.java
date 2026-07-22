package com.raghavendra.fraud_detection.controller;

import com.raghavendra.fraud_detection.dto.DashboardResponse;
import com.raghavendra.fraud_detection.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardResponse getSummary() {
        return dashboardService.getSummary();
    }
}