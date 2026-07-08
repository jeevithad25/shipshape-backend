package com.example.demo;

import com.example.demo.security.JwtUtil;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import static org.testng.Assert.*;

public class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeClass
    public void setUp() {
        jwtUtil = new JwtUtil();
    }

    @Test
    public void testGenerateToken_NotNull() {
        String token = jwtUtil.generateToken("testuser", "SYSTEM_ADMIN");
        assertNotNull(token);
    }

    @Test
    public void testGenerateToken_ExtractUsername() {
        String token = jwtUtil.generateToken("mariner01", "VESSEL_CAPTAIN");
        String extracted = jwtUtil.extractUsername(token);
        assertEquals(extracted, "mariner01");
    }

    @Test
    public void testGenerateToken_ExtractRole() {
        String token = jwtUtil.generateToken("admin", "SYSTEM_ADMIN");
        String role = jwtUtil.extractRole(token);
        assertEquals(role, "SYSTEM_ADMIN");
    }

    @Test
    public void testValidateToken_Valid() {
        String token = jwtUtil.generateToken("captain", "VESSEL_CAPTAIN");
        boolean valid = jwtUtil.validateToken(token, "captain");
        assertTrue(valid);
    }

    @Test
    public void testValidateToken_WrongUsername() {
        String token = jwtUtil.generateToken("captain", "VESSEL_CAPTAIN");
        boolean valid = jwtUtil.validateToken(token, "wronguser");
        assertFalse(valid);
    }

    @Test
    public void testGenerateToken_DifferentUsersHaveDifferentTokens() {
        String token1 = jwtUtil.generateToken("user1", "PORT_AUTHORITY");
        String token2 = jwtUtil.generateToken("user2", "PORT_AUTHORITY");
        assertNotEquals(token1, token2);
    }
}
