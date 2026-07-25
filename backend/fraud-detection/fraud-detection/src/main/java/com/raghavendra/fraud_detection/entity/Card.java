package com.raghavendra.fraud_detection.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Card number is required")
    @Pattern(
            regexp = "^[0-9]{16}$",
            message = "Card number must contain exactly 16 digits"
    )
    private String cardNumber;

    @NotBlank(message = "Card holder name is required")
    @Size(
            min = 2,
            max = 100,
            message = "Card holder name must be between 2 and 100 characters"
    )
    private String cardHolderName;

    @NotBlank(message = "Card type is required")
    private String cardType;

    @NotNull(message = "Balance is required")
    @DecimalMin(
            value = "0.0",
            inclusive = true,
            message = "Balance cannot be negative"
    )
    private Double balance;

    @NotNull(message = "User is required")
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "card")
    @JsonIgnore
    private List<Transaction> transactions;

    public Card() {
    }

    public Long getId() {
        return id;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardHolderName() {
        return cardHolderName;
    }

    public void setCardHolderName(String cardHolderName) {
        this.cardHolderName = cardHolderName;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }
}