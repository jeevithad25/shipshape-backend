package com.example.demo.service;

import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Vessel;
import com.example.demo.model.VesselStatus;
import com.example.demo.repository.VesselRepository;
import com.example.demo.repository.VoyageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VesselService {

    private final VesselRepository vesselRepository;
    private final VoyageRepository voyageRepository;

    public Vessel createVessel(Vessel vessel) {
        if (vesselRepository.existsByImoNumber(vessel.getImoNumber())) {
            throw new BusinessValidationException("IMO number already exists.");
        }
        return vesselRepository.save(vessel);
    }

    public Page<Vessel> getAllVessels(Pageable pageable) {
        return vesselRepository.findAll(pageable);
    }

    public Vessel getVesselById(Long id) {
        return vesselRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vessel not found with id: " + id));
    }

    public Vessel updateVesselStatus(Long id, VesselStatus status) {
        Vessel vessel = getVesselById(id);
        vessel.setStatus(status);
        return vesselRepository.save(vessel);
    }

    public void deleteVessel(Long id) {
        Vessel vessel = getVesselById(id);

        boolean hasActiveVoyages = voyageRepository.findAll().stream()
                .anyMatch(v -> v.getVessel() != null
                        && v.getVessel().getId().equals(id)
                        && v.getStatus() != com.example.demo.model.VoyageStatus.COMPLETED);

        if (hasActiveVoyages) {
            throw new BusinessValidationException("Cannot delete vessel with active voyages.");
        }

        vesselRepository.delete(vessel);
    }
}
