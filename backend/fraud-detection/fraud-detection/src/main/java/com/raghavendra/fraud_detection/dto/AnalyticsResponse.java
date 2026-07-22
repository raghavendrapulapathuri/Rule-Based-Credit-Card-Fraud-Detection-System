package com.raghavendra.fraud_detection.dto;

public class AnalyticsResponse {

    private long totalTransactions;
    private long fraudTransactions;
    private double fraudPercentage;

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public long getFraudTransactions() {
        return fraudTransactions;
    }

    public void setFraudTransactions(long fraudTransactions) {
        this.fraudTransactions = fraudTransactions;
    }

    public double getFraudPercentage() {
        return fraudPercentage;
    }

    public void setFraudPercentage(double fraudPercentage) {
        this.fraudPercentage = fraudPercentage;
    }
}