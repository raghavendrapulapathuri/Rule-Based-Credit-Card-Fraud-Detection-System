package com.raghavendra.fraud_detection.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    // =====================================================
    // ID
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // FULL NAME
    // =====================================================

    @NotBlank(message = "Full name is required")
    @Size(
            min = 2,
            max = 100,
            message = "Full name must be between 2 and 100 characters"
    )
    private String fullName;

    // =====================================================
    // EMAIL
    // =====================================================

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    @Column(
            unique = true,
            nullable = false
    )
    private String email;

    // =====================================================
    // PHONE NUMBER
    // =====================================================

    @NotBlank(message = "Phone number is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "Phone number must contain exactly 10 digits"
    )
    @Column(
            unique = true,
            nullable = false
    )
    private String phoneNumber;

    // =====================================================
    // PASSWORD
    // =====================================================

    /*
     * JsonIgnore prevents the password/hash from being
     * returned to the frontend through User JSON responses.
     *
     * nullable = true is temporary because your database
     * already contains old users created before we added
     * customer authentication.
     */
    @JsonIgnore
    @Column(nullable = true)
    private String password;

    // =====================================================
    // CREATED AT
    // =====================================================

    private LocalDateTime createdAt;

    // =====================================================
    // CARDS
    // =====================================================

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Card> cards;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public User() {
        this.createdAt = LocalDateTime.now();
    }

    // =====================================================
    // ID
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // =====================================================
    // FULL NAME
    // =====================================================

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    // =====================================================
    // EMAIL
    // =====================================================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // =====================================================
    // PHONE NUMBER
    // =====================================================

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    // =====================================================
    // PASSWORD
    // =====================================================

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // =====================================================
    // CREATED AT
    // =====================================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // =====================================================
    // CARDS
    // =====================================================

    public List<Card> getCards() {
        return cards;
    }

    public void setCards(List<Card> cards) {
        this.cards = cards;
    }
}