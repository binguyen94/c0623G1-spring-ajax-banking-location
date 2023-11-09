package com.example.banking_money.service.customer;

import com.example.banking_money.domain.Customer;
import com.example.banking_money.domain.LocationRegion;
import com.example.banking_money.exception.BankingNotFoundException;
import com.example.banking_money.repository.*;
import com.example.banking_money.service.customer.request.CustomerSaveRequest;
import com.example.banking_money.util.AppUtil;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final DepositRepository depositRepository;
    private final WithdrawRepository withdrawRepository;
    private final TransferRepository transferRepository;
    private final LocationRegionRepository locationRegionRepository;

    public List<Customer> findAll() {
        return customerRepository.findAll();
    }

    public Page<Customer> findAll(Pageable pageable) {
        return customerRepository.findAll(pageable);
    }

    public Customer findById(Long id) {
        return customerRepository.findById(id).get();
    }
    public void create(CustomerSaveRequest request) {
        Customer newCustomer = AppUtil.mapper.map(request, Customer.class);

        LocationRegion locationRegion = request.getLocationRegion();
        locationRegionRepository.save(locationRegion);
        newCustomer.setLocationRegion(locationRegion);

        customerRepository.save(newCustomer);
    }

    public Customer update(CustomerSaveRequest request, Long id) {
        Customer newCustomer = AppUtil.mapper.map(request, Customer.class);

        LocationRegion locationRegion = request.getLocationRegion();
        locationRegionRepository.save(locationRegion);
        newCustomer.setLocationRegion(locationRegion);

        Customer oldCustomer = findById(id);
        newCustomer.setId(id);
        newCustomer.setBalance(oldCustomer.getBalance());

        customerRepository.save(newCustomer);
        return newCustomer;
    }

    public void delete(Long id) {
//        customerRepository.deleteById(id);

        Optional<Customer> customerOptional = customerRepository.findById(id);
        if (customerOptional.isPresent()) {

            Customer customer = customerOptional.get();
            depositRepository.deleteAll(customer.getDeposits());
            withdrawRepository.deleteAll(customer.getWithdraws());
            transferRepository.deleteAll(customer.getSentTransfers());
            transferRepository.deleteAll(customer.getReceivedTransfers());

            customerRepository.deleteById(id);

        } else {
            throw new BankingNotFoundException("Khach hàng không tồn tại với ID: " + id);
        }
    }

}
