package com.example.demo;

import com.example.demo.config.SecurityConfig;
import com.example.demo.security.CustomUserDetailsService;
import com.example.demo.security.JwtAuthFilter;
import com.example.demo.security.JwtUtil;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.filter.OncePerRequestFilter;
import org.testng.annotations.Test;

import java.lang.reflect.Method;

import static org.testng.Assert.*;

public class SecurityAnnotationTest {

    @Test
    public void testJwtAuthFilterExtendsOncePerRequestFilter() {
        assertTrue(OncePerRequestFilter.class.isAssignableFrom(JwtAuthFilter.class),
                "JwtAuthFilter must extend OncePerRequestFilter");
    }

    @Test
    public void testJwtAuthFilterAnnotatedWithComponent() {
        boolean isComponent = JwtAuthFilter.class.isAnnotationPresent(Component.class);
        assertTrue(isComponent, "JwtAuthFilter must be annotated with @Component");
    }

    @Test
    public void testCustomUserDetailsServiceAnnotatedWithService() {
        boolean isService = CustomUserDetailsService.class.isAnnotationPresent(Service.class);
        assertTrue(isService, "CustomUserDetailsService must be annotated with @Service");
    }

    @Test
    public void testJwtUtilNoArgConstructor() throws Exception {
        JwtUtil jwtUtil = JwtUtil.class.getDeclaredConstructor().newInstance();
        assertNotNull(jwtUtil, "JwtUtil must be instantiable with no-arg constructor");
    }

    @Test
    public void testJwtUtil_GenerateTokenMethod() throws Exception {
        Method m = JwtUtil.class.getDeclaredMethod("generateToken", String.class, String.class);
        assertNotNull(m);
        assertEquals(m.getParameterCount(), 2);
    }

    @Test
    public void testJwtUtil_ValidateTokenMethod() throws Exception {
        Method m = JwtUtil.class.getDeclaredMethod("validateToken", String.class, String.class);
        assertNotNull(m);
        assertEquals(m.getReturnType(), boolean.class);
    }

    @Test
    public void testJwtUtil_IsTokenExpiredIsPrivate() throws Exception {
        Method m = JwtUtil.class.getDeclaredMethod("isTokenExpired", String.class);
        assertTrue(java.lang.reflect.Modifier.isPrivate(m.getModifiers()),
                "isTokenExpired must be private");
    }

    @Test
    public void testSecurityConfigAnnotatedWithConfiguration() {
        boolean hasConfig = SecurityConfig.class.isAnnotationPresent(
                org.springframework.context.annotation.Configuration.class);
        assertTrue(hasConfig, "SecurityConfig must be annotated with @Configuration");
    }
}
