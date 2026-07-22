package com.raghavendra.fraud_detection.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Rule-Based Credit Card Fraud Detection System is Running!";
    }
}