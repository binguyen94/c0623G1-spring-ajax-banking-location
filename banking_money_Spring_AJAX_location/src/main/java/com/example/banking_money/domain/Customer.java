package com.example.banking_money.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@Data
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    private String fullName;

    private String phone;

    private String email;

    private BigDecimal balance;

    @OneToMany(mappedBy = "customerDeposit")
    @JsonIgnore
    private List<Deposit> deposits;

    @OneToMany(mappedBy = "customerWithdraw")
    @JsonIgnore
    private List<Withdraw> withdraws;

    @OneToMany(mappedBy = "sender")
    @JsonIgnore
    private List<Transfer> sentTransfers;

    @OneToMany(mappedBy = "recipient")
    @JsonIgnore
    private List<Transfer> receivedTransfers;

    @OneToOne
    @JoinColumn(name = "location_region_id")
    private LocationRegion locationRegion;
}
