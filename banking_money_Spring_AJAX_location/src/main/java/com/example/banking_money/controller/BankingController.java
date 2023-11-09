package com.example.banking_money.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/home")
public class BankingController {
    @GetMapping
    public String show() {
        return "home";
    }
}
