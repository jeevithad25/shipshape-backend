package com.example.demo.service;

import com.example.demo.dto.VoyageRequestDto;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Port;
import com.example.demo.model.Vessel;
import com.example.demo.model.Voyage;
import com.example.demo.model.VoyageStatus;
import com.example.demo.repository.PortRepository;
import com.example.demo.repository.VesselRepository;
import com.example.demo.repository.VoyageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VoyageService {

    private final VoyageRepository voyageRepository;
    private final VesselRepository vesselRepository;
    private final PortRepository portRepository;

    public Voyage initiateVoyage(VoyageRequestDto request) {
        if (request.getOriginPortId().equals(request.getDestinationPortId())) {
            throw new BusinessValidationException("Origin and destination ports must be distinct.");
        }

        Vessel vessel = vesselRepository.findById(request.getVesselId())
                .orElseThrow(() -> new ResourceNotFoundException("Vessel not found with id: " + request.getVesselId()));

        Port originPort = portRepository.findById(request.getOriginPortId())
                .orElseThrow(() -> new ResourceNotFoundException("Origin port not found with id: " + request.getOriginPortId()));

        Port destinationPort = portRepository.findById(request.getDestinationPortId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination port not found with id: " + request.getDestinationPortId()));

        Voyage voyage = new Voyage();
        voyage.setVessel(vessel);
        voyage.setOriginPort(originPort);
        voyage.setDestinationPort(destinationPort);
        voyage.setDepartureDate(request.getDepartureDate());
        voyage.setStatus(VoyageStatus.PLANNED);

        return voyageRepository.save(voyage);
    }

    public List<Voyage> getAllVoyages() {
        return voyageRepository.findAll();
    }

    public Voyage getVoyageById(Long id) {
        return voyageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voyage not found with id: " + id));
    }
}
