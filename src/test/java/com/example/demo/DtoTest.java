package com.example.demo;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.dto.VoyageRequestDto;
import com.example.demo.model.UserRole;
import org.testng.annotations.Test;

import java.time.LocalDateTime;
import java.lang.reflect.Constructor;

import static org.testng.Assert.*;

public class DtoTest {

    @Test
    public void testAuthRequestDtoFields() {
        AuthRequestDto dto = new AuthRequestDto("testuser", "password123");
        assertEquals(dto.getUsername(), "testuser");
        assertEquals(dto.getPassword(), "password123");
    }

    @Test
    public void testAuthResponseDtoAllArgsConstructor() throws Exception {
        Constructor<AuthResponseDto> ctor = AuthResponseDto.class
                .getDeclaredConstructor(String.class, String.class, String.class);
        AuthResponseDto dto = ctor.newInstance("token_xyz", "admin", "SYSTEM_ADMIN");
        assertEquals(dto.getToken(), "token_xyz");
        assertEquals(dto.getUsername(), "admin");
        assertEquals(dto.getRole(), "SYSTEM_ADMIN");
    }

    @Test
    public void testAuthResponseDtoSettersAndGetters() {
        AuthResponseDto dto = new AuthResponseDto();
        dto.setToken("abc");
        dto.setUsername("user");
        dto.setRole("VESSEL_CAPTAIN");
        assertEquals(dto.getToken(), "abc");
        assertEquals(dto.getUsername(), "user");
        assertEquals(dto.getRole(), "VESSEL_CAPTAIN");
    }

    @Test
    public void testRegisterDtoFields() {
        RegisterDto dto = new RegisterDto("newuser", "pass", "new@sea.com", UserRole.PORT_AUTHORITY);
        assertEquals(dto.getUsername(), "newuser");
        assertEquals(dto.getEmail(), "new@sea.com");
        assertEquals(dto.getRole(), UserRole.PORT_AUTHORITY);
    }

    @Test
    public void testVoyageRequestDtoFields() {
        LocalDateTime now = LocalDateTime.now();
        VoyageRequestDto dto = new VoyageRequestDto(1L, 2L, 3L, now);
        assertEquals(dto.getVesselId(), 1L);
        assertEquals(dto.getOriginPortId(), 2L);
        assertEquals(dto.getDestinationPortId(), 3L);
        assertEquals(dto.getDepartureDate(), now);
    }
}
