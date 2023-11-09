package com.example.banking_money.service.transfer.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
public class TransferSaveRequest {

    private String transactionAmount;

    private String senderId;

    private String recipientId;
}
