package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Port {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "port_code", nullable = false, unique = true)
    private String portCode;

    @Column(nullable = false)
    private String country;
}
