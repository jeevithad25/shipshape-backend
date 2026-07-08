package com.example.demo.repository;

import com.example.demo.model.Port;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortRepository extends JpaRepository<Port, Long> {

    List<Port> findByCountry(String country);

    boolean existsByPortCode(String portCode);
}
