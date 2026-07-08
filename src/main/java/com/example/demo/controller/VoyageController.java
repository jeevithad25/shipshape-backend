package com.example.demo.controller;

import com.example.demo.dto.VoyageRequestDto;
import com.example.demo.model.Voyage;
import com.example.demo.service.VoyageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voyages")
@RequiredArgsConstructor
public class VoyageController {

    private final VoyageService voyageService;

    @GetMapping
    public ResponseEntity<List<Voyage>> getAllVoyages() {
        return ResponseEntity.ok(voyageService.getAllVoyages());
    }

    @PostMapping
    public ResponseEntity<Voyage> create(@Valid @RequestBody VoyageRequestDto request) {
        Voyage voyage = voyageService.initiateVoyage(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(voyage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voyage> getById(@PathVariable Long id) {
        return ResponseEntity.ok(voyageService.getVoyageById(id));
    }
}
