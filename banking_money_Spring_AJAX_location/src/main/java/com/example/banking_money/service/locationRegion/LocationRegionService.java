package com.example.banking_money.service.locationRegion;


import com.example.banking_money.domain.LocationRegion;
import com.example.banking_money.repository.LocationRegionRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@AllArgsConstructor
@Transactional
public class LocationRegionService {

    private final LocationRegionRepository locationRegionRepository;

    public List<LocationRegion> findAll() {
        return locationRegionRepository.findAll();
    }
}
