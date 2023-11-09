package com.example.banking_money.service.transfer;

import com.example.banking_money.domain.Customer;
import com.example.banking_money.domain.Transfer;
import com.example.banking_money.repository.CustomerRepository;
import com.example.banking_money.repository.TransferRepository;
import com.example.banking_money.service.transfer.request.TransferSaveRequest;
import com.example.banking_money.util.AppUtil;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@AllArgsConstructor
@Transactional
public class TransferService {

    private final TransferRepository transferRepository;

    private final CustomerRepository customerRepository;

    public Customer transfer(TransferSaveRequest request) {
        Transfer transfer = AppUtil.mapper.map(request, Transfer.class);

        Customer sender = customerRepository.findById(Long.valueOf(request.getSenderId())).orElseThrow(() -> new RuntimeException("Không tìm thấy người gửi"));
        Customer recipient = customerRepository.findById(Long.valueOf(request.getRecipientId())).orElseThrow(() -> new RuntimeException("Không tìm thấy người nhận"));

        transfer.setSender(sender);
        transfer.setRecipient(recipient);
        transfer.setDate(LocalDate.now());
        transferRepository.save(transfer);

        sender.setBalance(sender.getBalance().subtract(transfer.getTransactionAmount()));
        recipient.setBalance(recipient.getBalance().add(transfer.getTransactionAmount()));
        customerRepository.save(sender);
        customerRepository.save(recipient);

        return sender;
    }
}
