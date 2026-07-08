package com.example.demo.repository;

import com.example.demo.model.Vessel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VesselRepository extends JpaRepository<Vessel, Long> {

    boolean existsByImoNumber(String imoNumber);

    Page<Vessel> findAll(Pageable pageable);
}
