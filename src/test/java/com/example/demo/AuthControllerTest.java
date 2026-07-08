package com.example.demo;

import com.example.demo.controller.AuthController;
import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.model.UserRole;
import com.example.demo.service.AuthService;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

import static org.testng.Assert.*;

public class AuthControllerTest {

    private AuthController authController;
    private AuthService authService;

    @BeforeMethod
    public void setUp() throws Exception {
        // Reflection-based instantiation — no Spring context needed
        Class<?> controllerClass = AuthController.class;
        Constructor<?>[] constructors = controllerClass.getDeclaredConstructors();
        assertTrue(constructors.length > 0, "AuthController must have a constructor");
    }

    @Test
    public void testAuthControllerHasLoginMethod() throws Exception {
        Method loginMethod = AuthController.class.getDeclaredMethod("login", AuthRequestDto.class);
        assertNotNull(loginMethod, "login method must exist accepting AuthRequestDto");
    }

    @Test
    public void testAuthControllerHasRegisterMethod() throws Exception {
        Method registerMethod = AuthController.class.getDeclaredMethod("register", RegisterDto.class);
        assertNotNull(registerMethod, "register method must exist accepting RegisterDto");
    }

    @Test
    public void testLoginMethodReturnsAuthResponseDto() throws Exception {
        Method loginMethod = AuthController.class.getDeclaredMethod("login", AuthRequestDto.class);
        assertEquals(loginMethod.getReturnType(), AuthResponseDto.class,
                "login must return AuthResponseDto directly");
    }

    @Test
    public void testLoginMethodAnnotatedWithPostMapping() throws Exception {
        Method loginMethod = AuthController.class.getDeclaredMethod("login", AuthRequestDto.class);
        boolean hasPostMapping = java.util.Arrays.stream(loginMethod.getDeclaredAnnotations())
                .anyMatch(a -> a.annotationType().getSimpleName().equals("PostMapping"));
        assertTrue(hasPostMapping, "login must be annotated with @PostMapping");
    }

    @Test
    public void testRegisterMethodAnnotatedWithPostMapping() throws Exception {
        Method registerMethod = AuthController.class.getDeclaredMethod("register", RegisterDto.class);
        boolean hasPostMapping = java.util.Arrays.stream(registerMethod.getDeclaredAnnotations())
                .anyMatch(a -> a.annotationType().getSimpleName().equals("PostMapping"));
        assertTrue(hasPostMapping, "register must be annotated with @PostMapping");
    }

    @Test
    public void testAuthResponseDtoAllArgsConstructor() throws Exception {
        Constructor<AuthResponseDto> ctor = AuthResponseDto.class
                .getDeclaredConstructor(String.class, String.class, String.class);
        assertNotNull(ctor, "AuthResponseDto must have all-args constructor (String token, String username, String role)");

        AuthResponseDto dto = ctor.newInstance("tok123", "admin", "SYSTEM_ADMIN");
        assertEquals(dto.getToken(), "tok123");
        assertEquals(dto.getUsername(), "admin");
        assertEquals(dto.getRole(), "SYSTEM_ADMIN");
    }
}
