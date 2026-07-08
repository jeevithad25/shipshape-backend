package com.example.demo;

import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.GlobalExceptionHandler;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.UnauthorizedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.lang.reflect.Method;
import java.util.Map;

import static org.testng.Assert.*;

public class ExceptionHandlingTest {

    private GlobalExceptionHandler handler;

    @BeforeClass
    public void setUp() {
        handler = new GlobalExceptionHandler();
    }

    @Test
    public void testGlobalExceptionHandlerAnnotatedWithRestControllerAdvice() {
        boolean hasAdvice = GlobalExceptionHandler.class.isAnnotationPresent(RestControllerAdvice.class);
        assertTrue(hasAdvice, "GlobalExceptionHandler must be annotated with @RestControllerAdvice");
    }

    @Test
    public void testHandleResourceNotFoundMethodExists() throws Exception {
        Method method = GlobalExceptionHandler.class
                .getDeclaredMethod("handleResourceNotFound", ResourceNotFoundException.class);
        assertNotNull(method, "handleResourceNotFound method must exist");
    }

    @Test
    public void testHandleBusinessValidationMethodExists() throws Exception {
        Method method = GlobalExceptionHandler.class
                .getDeclaredMethod("handleBusinessValidation", BusinessValidationException.class);
        assertNotNull(method, "handleBusinessValidation method must exist");
    }

    @Test
    public void testHandleResourceNotFound_Returns404() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Vessel not found with id: 99");
        ResponseEntity<?> response = handler.handleResourceNotFound(ex);
        assertEquals(response.getStatusCode(), HttpStatus.NOT_FOUND);
    }

    @Test
    public void testHandleResourceNotFound_BodyContainsMessage() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Port not found");
        ResponseEntity<Map<String, String>> response = handler.handleResourceNotFound(ex);
        Map<String, String> body = response.getBody();
        assertNotNull(body);
        assertEquals(body.get("message"), "Port not found");
    }

    @Test
    public void testHandleBusinessValidation_Returns400() {
        BusinessValidationException ex = new BusinessValidationException("Duplicate IMO number");
        ResponseEntity<?> response = handler.handleBusinessValidation(ex);
        assertEquals(response.getStatusCode(), HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testHandleBusinessValidation_BodyContainsMessage() {
        BusinessValidationException ex = new BusinessValidationException("IMO already exists.");
        ResponseEntity<Map<String, String>> response = handler.handleBusinessValidation(ex);
        Map<String, String> body = response.getBody();
        assertNotNull(body);
        assertEquals(body.get("message"), "IMO already exists.");
    }

    @Test
    public void testResourceNotFoundException_StringConstructor() {
        ResourceNotFoundException ex = new ResourceNotFoundException("test");
        assertEquals(ex.getMessage(), "test");
        assertTrue(ex instanceof RuntimeException);
    }

    @Test
    public void testBusinessValidationException_StringConstructor() {
        BusinessValidationException ex = new BusinessValidationException("bad data");
        assertEquals(ex.getMessage(), "bad data");
        assertTrue(ex instanceof RuntimeException);
    }

    @Test
    public void testUnauthorizedException_StringConstructor() {
        UnauthorizedException ex = new UnauthorizedException("forbidden");
        assertEquals(ex.getMessage(), "forbidden");
        assertTrue(ex instanceof RuntimeException);
    }
}
