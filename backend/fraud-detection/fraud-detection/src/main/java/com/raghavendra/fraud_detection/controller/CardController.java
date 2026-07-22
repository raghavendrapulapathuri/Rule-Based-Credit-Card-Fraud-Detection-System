package com.raghavendra.fraud_detection.controller;

import com.raghavendra.fraud_detection.entity.Card;
import com.raghavendra.fraud_detection.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cards")
public class CardController {

    @Autowired
    private CardService cardService;

    @PostMapping
    public Card saveCard(@RequestBody Card card) {
        return cardService.saveCard(card);
    }

    @GetMapping
    public List<Card> getAllCards() {
        return cardService.getAllCards();
    }
}