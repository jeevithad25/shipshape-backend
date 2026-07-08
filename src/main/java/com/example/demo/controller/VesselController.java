package com.example.demo.controller;

import com.example.demo.model.Vessel;
import com.example.demo.model.VesselStatus;
import com.example.demo.service.VesselService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vessels")
@RequiredArgsConstructor
public class VesselController {

    private final VesselService vesselService;

    @GetMapping
    public ResponseEntity<Page<Vessel>> getAllVessels(Pageable pageable) {
        return ResponseEntity.ok(vesselService.getAllVessels(pageable));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_SYSTEM_ADMIN')")
    public ResponseEntity<String> create(@Valid @RequestBody Vessel vessel) {
        vesselService.createVessel(vessel);
        return ResponseEntity.status(HttpStatus.CREATED).body("Vessel created successfully.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vessel> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vesselService.getVesselById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestBody VesselStatus status) {
        vesselService.updateVesselStatus(id, status);
        return ResponseEntity.ok("Vessel updated successfully.");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_SYSTEM_ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        vesselService.deleteVessel(id);
        return ResponseEntity.ok("Vessel deleted successfully.");
    }
}
