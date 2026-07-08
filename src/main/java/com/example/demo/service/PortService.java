package com.example.demo.service;

import com.example.demo.exception.BusinessValidationException;
import com.example.demo.model.Port;
import com.example.demo.repository.PortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortService {

    private final PortRepository portRepository;

    public List<Port> getAllPorts() {
        return portRepository.findAll();
    }

    public Port createPort(Port port) {
        if (portRepository.existsByPortCode(port.getPortCode())) {
            throw new BusinessValidationException("Port code already exists.");
        }
        return portRepository.save(port);
    }
}
