package com.example.demo.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoyageRequestDto {

    @NotNull
    private Long vesselId;

    @NotNull
    private Long originPortId;

    @NotNull
    private Long destinationPortId;

    @NotNull
    private LocalDateTime departureDate;
}
