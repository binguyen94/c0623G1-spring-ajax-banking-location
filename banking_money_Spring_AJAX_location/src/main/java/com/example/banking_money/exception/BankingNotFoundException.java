package com.example.banking_money.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class BankingNotFoundException extends RuntimeException{

    public BankingNotFoundException(String message) {
        super(message);
    }
}