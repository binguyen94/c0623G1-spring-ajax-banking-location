package com.example.banking_money.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "deposits")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Deposit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal deposit;

    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "customers_id")
    private Customer customerDeposit;
}
