package com.example.demo.controller;

import com.example.demo.model.Port;
import com.example.demo.service.PortService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ports")
@RequiredArgsConstructor
public class PortController {

    private final PortService portService;

    @GetMapping
    public ResponseEntity<List<Port>> getAllPorts() {
        return ResponseEntity.ok(portService.getAllPorts());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SYSTEM_ADMIN')")
    public ResponseEntity<Port> createPort(@Valid @RequestBody Port port) {
        Port created = portService.createPort(port);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
