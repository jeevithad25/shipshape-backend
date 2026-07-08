package com.example.demo;

import com.example.demo.model.*;
import org.testng.annotations.Test;

import java.time.LocalDateTime;

import static org.testng.Assert.*;

public class ModelTest {

    @Test
    public void testUserEntityFields() {
        User user = new User();
        user.setId(1L);
        user.setUsername("captain_smith");
        user.setPassword("enc_pass");
        user.setEmail("smith@sea.com");
        user.setRole(UserRole.VESSEL_CAPTAIN);

        assertEquals(user.getUsername(), "captain_smith");
        assertEquals(user.getEmail(), "smith@sea.com");
        assertEquals(user.getRole(), UserRole.VESSEL_CAPTAIN);
    }

    @Test
    public void testVesselEntityFields() {
        Vessel vessel = new Vessel();
        vessel.setId(1L);
        vessel.setName("MV Oceanic");
        vessel.setImoNumber("IMO1234567");
        vessel.setVesselType(VesselType.CONTAINER);
        vessel.setDeadweightTonnage(80000.0);
        vessel.setStatus(VesselStatus.MOORED);

        assertEquals(vessel.getName(), "MV Oceanic");
        assertEquals(vessel.getImoNumber(), "IMO1234567");
        assertEquals(vessel.getVesselType(), VesselType.CONTAINER);
        assertEquals(vessel.getDeadweightTonnage(), 80000.0);
        assertEquals(vessel.getStatus(), VesselStatus.MOORED);
    }

    @Test
    public void testPortEntityFields() {
        Port port = new Port(1L, "Port of Hamburg", "DEHAM", "Germany");
        assertEquals(port.getName(), "Port of Hamburg");
        assertEquals(port.getPortCode(), "DEHAM");
        assertEquals(port.getCountry(), "Germany");
    }

    @Test
    public void testVoyageEntityFields() {
        Vessel vessel = new Vessel();
        vessel.setId(1L);
        Port origin = new Port(1L, "Singapore", "SGSIN", "Singapore");
        Port destination = new Port(2L, "Rotterdam", "NLRTM", "Netherlands");

        Voyage voyage = new Voyage();
        voyage.setVessel(vessel);
        voyage.setOriginPort(origin);
        voyage.setDestinationPort(destination);
        voyage.setDepartureDate(LocalDateTime.now());
        voyage.setStatus(VoyageStatus.PLANNED);

        assertNotNull(voyage.getVessel());
        assertNotNull(voyage.getOriginPort());
        assertEquals(voyage.getStatus(), VoyageStatus.PLANNED);
    }

    @Test
    public void testCargoEntityFields() {
        Cargo cargo = new Cargo();
        cargo.setDescription("500x Electronics Containers");
        cargo.setWeightTons(200.5);
        cargo.setCargoType(CargoType.GENERAL);
        cargo.setStatus(CargoStatus.PENDING);

        assertEquals(cargo.getDescription(), "500x Electronics Containers");
        assertEquals(cargo.getWeightTons(), 200.5);
        assertEquals(cargo.getCargoType(), CargoType.GENERAL);
        assertEquals(cargo.getStatus(), CargoStatus.PENDING);
    }

    @Test
    public void testUserRoleEnumValues() {
        assertEquals(UserRole.values().length, 4);
        assertNotNull(UserRole.valueOf("SYSTEM_ADMIN"));
        assertNotNull(UserRole.valueOf("PORT_AUTHORITY"));
        assertNotNull(UserRole.valueOf("VESSEL_CAPTAIN"));
        assertNotNull(UserRole.valueOf("LOGISTICS_COORDINATOR"));
    }

    @Test
    public void testVesselStatusEnumValues() {
        assertEquals(VesselStatus.values().length, 3);
        assertNotNull(VesselStatus.valueOf("MOORED"));
        assertNotNull(VesselStatus.valueOf("AT_SEA"));
        assertNotNull(VesselStatus.valueOf("UNDER_MAINTENANCE"));
    }

    @Test
    public void testVoyageStatusEnumValues() {
        assertEquals(VoyageStatus.values().length, 4);
        assertNotNull(VoyageStatus.valueOf("PLANNED"));
        assertNotNull(VoyageStatus.valueOf("IN_TRANSIT"));
        assertNotNull(VoyageStatus.valueOf("COMPLETED"));
        assertNotNull(VoyageStatus.valueOf("DELAYED"));
    }

    @Test
    public void testCargoTypeEnumValues() {
        assertEquals(CargoType.values().length, 3);
        assertNotNull(CargoType.valueOf("GENERAL"));
        assertNotNull(CargoType.valueOf("HAZARDOUS"));
        assertNotNull(CargoType.valueOf("REFRIGERATED"));
    }

    @Test
    public void testCargoStatusEnumValues() {
        assertEquals(CargoStatus.values().length, 4);
        assertNotNull(CargoStatus.valueOf("PENDING"));
        assertNotNull(CargoStatus.valueOf("LOADED"));
        assertNotNull(CargoStatus.valueOf("IN_TRANSIT"));
        assertNotNull(CargoStatus.valueOf("DELIVERED"));
    }
}
