package com.example.demo.controller;

import com.example.demo.model.Cargo;
import com.example.demo.service.CargoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cargo")
@RequiredArgsConstructor
public class CargoController {

    private final CargoService cargoService;

    @PostMapping
    public Cargo create(@Valid @RequestBody Cargo cargo) {
        return cargoService.createCargo(cargo);
    }

    @GetMapping("/voyage/{id}")
    public ResponseEntity<List<Cargo>> getByVoyage(@PathVariable Long id) {
        return ResponseEntity.ok(cargoService.getCargoByVoyage(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        cargoService.deleteCargo(id);
        return ResponseEntity.ok("Cargo deleted successfully.");
    }
}
