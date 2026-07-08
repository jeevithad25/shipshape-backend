package com.example.demo.repository;

import com.example.demo.model.Voyage;
import com.example.demo.model.VoyageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoyageRepository extends JpaRepository<Voyage, Long> {

    List<Voyage> findByStatus(VoyageStatus status);
}
