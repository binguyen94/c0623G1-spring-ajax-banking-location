package com.example.banking_money.service.deposit;


import com.example.banking_money.domain.Customer;
import com.example.banking_money.domain.Deposit;
import com.example.banking_money.repository.CustomerRepository;
import com.example.banking_money.repository.DepositRepository;
import com.example.banking_money.service.deposit.request.DepositSaveRequest;
import com.example.banking_money.util.AppUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@AllArgsConstructor
@Transactional
public class DepositService {


    private final DepositRepository depositRepository;

    private final CustomerRepository customerRepository;

    public Customer add(DepositSaveRequest request, Long id) {
        Deposit deposit = AppUtil.mapper.map(request, Deposit.class);
        Customer customer = customerRepository.findById(id).get();

        deposit.setCustomerDeposit(customer);
        deposit.setDate(LocalDate.now());
        depositRepository.save(deposit);

        customer.setBalance(customer.getBalance().add(deposit.getDeposit()));
        customerRepository.save(customer);

        return customer;
    }
}
