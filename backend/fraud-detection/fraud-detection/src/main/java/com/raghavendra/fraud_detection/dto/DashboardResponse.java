package com.raghavendra.fraud_detection.dto;

public class DashboardResponse {

    private long totalTransactions;
    private long safeTransactions;
    private long suspiciousTransactions;
    private long fraudTransactions;
    private long totalAlerts;

    public DashboardResponse() {
    }

    public DashboardResponse(long totalTransactions,
                             long safeTransactions,
                             long suspiciousTransactions,
                             long fraudTransactions,
                             long totalAlerts) {
        this.totalTransactions = totalTransactions;
        this.safeTransactions = safeTransactions;
        this.suspiciousTransactions = suspiciousTransactions;
        this.fraudTransactions = fraudTransactions;
        this.totalAlerts = totalAlerts;
    }

    public long getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(long totalTransactions) {
        this.totalTransactions = totalTransactions;
    }

    public long getSafeTransactions() {
        return safeTransactions;
    }

    public void setSafeTransactions(long safeTransactions) {
        this.safeTransactions = safeTransactions;
    }

    public long getSuspiciousTransactions() {
        return suspiciousTransactions;
    }

    public void setSuspiciousTransactions(long suspiciousTransactions) {
        this.suspiciousTransactions = suspiciousTransactions;
    }

    public long getFraudTransactions() {
        return fraudTransactions;
    }

    public void setFraudTransactions(long fraudTransactions) {
        this.fraudTransactions = fraudTransactions;
    }

    public long getTotalAlerts() {
        return totalAlerts;
    }

    public void setTotalAlerts(long totalAlerts) {
        this.totalAlerts = totalAlerts;
    }
}