package com.example.banking_money.service.customer.request;


import com.example.banking_money.domain.LocationRegion;
import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class CustomerSaveRequest {
    private String fullName;
    private String phone;
    private String email;
    private LocationRegion locationRegion;
    private String balance;
}
