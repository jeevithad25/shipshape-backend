package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Cargo;
import com.example.demo.model.Voyage;
import com.example.demo.repository.CargoRepository;
import com.example.demo.repository.VoyageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CargoService {

    private final CargoRepository cargoRepository;
    private final VoyageRepository voyageRepository;

    public Cargo createCargo(Cargo cargo) {
        if (cargo.getVoyage() != null && cargo.getVoyage().getId() != null) {
            Voyage voyage = voyageRepository.findById(cargo.getVoyage().getId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Voyage not found with id: " + cargo.getVoyage().getId()));
            cargo.setVoyage(voyage);
        }
        return cargoRepository.save(cargo);
    }

    public List<Cargo> getCargoByVoyage(Long voyageId) {
        return cargoRepository.findByVoyageId(voyageId);
    }

    public Cargo getCargoById(Long id) {
        return cargoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo not found with id: " + id));
    }

    public void deleteCargo(Long id) {
        Cargo cargo = getCargoById(id);
        cargoRepository.delete(cargo);
    }
}
