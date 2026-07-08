package com.example.demo;

import com.example.demo.controller.CargoController;
import com.example.demo.model.Cargo;
import com.example.demo.service.CargoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.testng.annotations.Test;

import java.lang.reflect.Method;
import java.util.Arrays;

import static org.testng.Assert.*;

public class CargoControllerTest {

    @Test
    public void testCargoControllerAcceptsCargoServiceViaConstructor() {
        boolean hasServiceConstructor = Arrays.stream(CargoController.class.getDeclaredConstructors())
                .anyMatch(c -> c.getParameterCount() == 1
                        && c.getParameterTypes()[0].equals(CargoService.class));
        assertTrue(hasServiceConstructor, "CargoController must accept CargoService via constructor injection");
    }

    @Test
    public void testCreateMethodExists() throws Exception {
        Method createMethod = CargoController.class.getDeclaredMethod("create", Cargo.class);
        assertNotNull(createMethod, "CargoController must expose a create(Cargo) method");
    }

    @Test
    public void testCreateMethodAnnotatedWithPostMapping() throws Exception {
        Method createMethod = CargoController.class.getDeclaredMethod("create", Cargo.class);
        boolean hasPostMapping = Arrays.stream(createMethod.getDeclaredAnnotations())
                .anyMatch(a -> a.annotationType().equals(PostMapping.class));
        assertTrue(hasPostMapping, "create must be annotated with @PostMapping");
    }

    @Test
    public void testCreateMethodReturnTypeCargo() throws Exception {
        Method createMethod = CargoController.class.getDeclaredMethod("create", Cargo.class);
        assertEquals(createMethod.getReturnType(), Cargo.class,
                "create must return Cargo directly");
    }

    @Test
    public void testDeleteMethodExists() throws Exception {
        Method deleteMethod = CargoController.class.getDeclaredMethod("delete", Long.class);
        assertNotNull(deleteMethod, "CargoController must expose a delete(Long id) method");
    }

    @Test
    public void testDeleteMethodReturnsResponseEntity() throws Exception {
        Method deleteMethod = CargoController.class.getDeclaredMethod("delete", Long.class);
        assertEquals(deleteMethod.getReturnType(), ResponseEntity.class);
    }
}
