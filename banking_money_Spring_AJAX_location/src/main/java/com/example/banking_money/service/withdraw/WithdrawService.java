package com.example.banking_money.service.withdraw;


import com.example.banking_money.domain.Customer;
import com.example.banking_money.domain.Withdraw;
import com.example.banking_money.repository.CustomerRepository;
import com.example.banking_money.repository.WithdrawRepository;
import com.example.banking_money.service.withdraw.request.WithdrawSaveRequest;
import com.example.banking_money.util.AppUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@AllArgsConstructor
@Transactional
public class WithdrawService {

    private final WithdrawRepository withdrawRepository;

    private final CustomerRepository customerRepository;

    public Customer decrementAmount(WithdrawSaveRequest request, Long id) {
        Withdraw withdraw = AppUtil.mapper.map(request, Withdraw.class);
        Customer customer = customerRepository.findById(id).get();

        withdraw.setCustomerWithdraw(customer);
        withdraw.setDate(LocalDate.now());
        withdrawRepository.save(withdraw);

        customer.setBalance(customer.getBalance().subtract(withdraw.getWithdraw()));
        customerRepository.save(customer);

        return customer;
    }
}
