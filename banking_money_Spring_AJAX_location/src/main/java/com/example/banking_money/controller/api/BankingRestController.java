package com.example.banking_money.controller.api;


import com.example.banking_money.domain.Customer;
import com.example.banking_money.service.customer.CustomerService;
import com.example.banking_money.service.customer.request.CustomerSaveRequest;
import com.example.banking_money.service.deposit.DepositService;
import com.example.banking_money.service.deposit.request.DepositSaveRequest;
import com.example.banking_money.service.transfer.TransferService;
import com.example.banking_money.service.transfer.request.TransferSaveRequest;
import com.example.banking_money.service.withdraw.WithdrawService;
import com.example.banking_money.service.withdraw.request.WithdrawSaveRequest;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/customer")
@AllArgsConstructor
public class BankingRestController {

    private final CustomerService customerService;

    private final DepositService depositService;

    private final WithdrawService withdrawService;

    private final TransferService transferService;


    @GetMapping
    public Page<Customer> findAll(@PageableDefault() Pageable pageable) {
        return customerService.findAll(pageable);
    }

    @GetMapping("/all")
    public List<Customer> findAll() {
        return customerService.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody @Valid CustomerSaveRequest request,  BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Validation failed: " + bindingResult.getAllErrors());
        }
        customerService.create(request);
        return ResponseEntity.ok(request);
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getById( @PathVariable Long id) {
        Customer customer = customerService.findById(id);
        return ResponseEntity.ok(customer);
    }
    @PatchMapping("{id}")
    public ResponseEntity<?> update(@RequestBody  @Valid CustomerSaveRequest request, @PathVariable Long id, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Validation failed: " + bindingResult.getAllErrors());
        }
        Customer customer = customerService.update(request, id);
        return ResponseEntity.ok(customer);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        customerService.delete(id);
        return ResponseEntity.noContent().build();
    }



    @PostMapping("/deposit/{id}")
    public ResponseEntity<?> recharge(@RequestBody DepositSaveRequest request, @PathVariable Long id) {
        Customer customer = depositService.add(request, id);
        return ResponseEntity.ok(customer);
    }

    @PostMapping("/withdraw/{id}")
    public ResponseEntity<?> decrementAmount(@RequestBody WithdrawSaveRequest request, @PathVariable Long id) {
        Customer customer = withdrawService.decrementAmount(request, id);
        return ResponseEntity.ok(customer);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transactionAmount(@RequestBody TransferSaveRequest request) {
        Customer customer = transferService.transfer(request);
        return ResponseEntity.ok(customer);
    }

}
