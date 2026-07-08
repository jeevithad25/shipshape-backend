package com.example.demo.model;

import jakarta.persistence.*;
//import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "vessels")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vessel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "imo_number", nullable = false, unique = true)
    private String imoNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VesselType vesselType;

    @Positive
    @Column(nullable = false)
    private Double deadweightTonnage;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VesselStatus status;
}
