package com.example.demo;

import com.example.demo.controller.VoyageController;
import com.example.demo.dto.VoyageRequestDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.testng.annotations.Test;

import java.lang.reflect.Method;
import java.util.Arrays;

import static org.testng.Assert.*;

public class VoyageControllerTest {

    @Test
    public void testCreateMethodExists() throws Exception {
        Method createMethod = VoyageController.class.getDeclaredMethod("create", VoyageRequestDto.class);
        assertNotNull(createMethod, "VoyageController must have a create(VoyageRequestDto) method");
    }

    @Test
    public void testCreateMethodAnnotatedWithPostMapping() throws Exception {
        Method createMethod = VoyageController.class.getDeclaredMethod("create", VoyageRequestDto.class);
        boolean hasPostMapping = Arrays.stream(createMethod.getDeclaredAnnotations())
                .anyMatch(a -> a.annotationType().equals(PostMapping.class));
        assertTrue(hasPostMapping, "create must be annotated with @PostMapping");
    }

    @Test
    public void testCreateMethodAcceptsVoyageRequestDto() throws Exception {
        Method createMethod = VoyageController.class.getDeclaredMethod("create", VoyageRequestDto.class);
        assertEquals(createMethod.getParameterTypes()[0], VoyageRequestDto.class,
                "create must accept VoyageRequestDto as parameter");
    }
}
