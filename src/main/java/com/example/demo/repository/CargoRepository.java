package com.example.demo.repository;

import com.example.demo.model.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CargoRepository extends JpaRepository<Cargo, Long> {

    List<Cargo> findByVoyageId(Long voyageId);
}
