package com.example.demo;

import com.example.demo.controller.VesselController;
import com.example.demo.model.Vessel;
import com.example.demo.model.VesselStatus;
import com.example.demo.service.VesselService;
import org.springframework.http.ResponseEntity;
import org.testng.annotations.Test;

import java.lang.reflect.Method;
import java.util.Arrays;

import static org.testng.Assert.*;

public class VesselControllerTest {

    @Test
    public void testVesselControllerAcceptsVesselServiceViaConstructor() throws Exception {
        boolean hasServiceConstructor = Arrays.stream(VesselController.class.getDeclaredConstructors())
                .anyMatch(c -> c.getParameterCount() == 1
                        && c.getParameterTypes()[0].equals(VesselService.class));
        assertTrue(hasServiceConstructor, "VesselController must accept VesselService via constructor injection");
    }

    @Test
    public void testCreateMethodHasPreAuthorizeWithSystemAdmin() throws Exception {
        Method createMethod = VesselController.class.getDeclaredMethod("create", Vessel.class);
        boolean hasPreAuthorize = Arrays.stream(createMethod.getDeclaredAnnotations())
                .anyMatch(a -> a.annotationType().getSimpleName().equals("PreAuthorize"));
        assertTrue(hasPreAuthorize, "create must be annotated with @PreAuthorize");

        var annotation = createMethod.getAnnotation(
                org.springframework.security.access.prepost.PreAuthorize.class);
        assertNotNull(annotation);
        assertTrue(annotation.value().contains("ROLE_SYSTEM_ADMIN"),
                "@PreAuthorize value must contain ROLE_SYSTEM_ADMIN");
    }

    @Test
    public void testDeleteMethodExists() throws Exception {
        Method deleteMethod = VesselController.class.getDeclaredMethod("delete", Long.class);
        assertNotNull(deleteMethod, "VesselController must expose a delete(Long id) method");
    }

    @Test
    public void testDeleteMethodReturnsResponseEntityString() throws Exception {
        Method deleteMethod = VesselController.class.getDeclaredMethod("delete", Long.class);
        assertEquals(deleteMethod.getReturnType(), ResponseEntity.class,
                "delete must return ResponseEntity<String>");
    }

    @Test
    public void testUpdateStatusMethodSignature() throws Exception {
        Method updateMethod = VesselController.class.getDeclaredMethod("updateStatus", Long.class, VesselStatus.class);
        assertNotNull(updateMethod, "updateStatus method must exist with Long id and VesselStatus params");
        assertEquals(updateMethod.getReturnType(), ResponseEntity.class);
    }
}
