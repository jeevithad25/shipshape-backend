package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cargo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cargo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voyage_id", nullable = false)
    private Voyage voyage;

    @NotBlank
    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double weightTons;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CargoType cargoType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CargoStatus status;
}
