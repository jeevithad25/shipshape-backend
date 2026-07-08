package com.example.demo.config;

import com.example.demo.model.Port;
import com.example.demo.model.User;
import com.example.demo.model.UserRole;
import com.example.demo.repository.PortRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PortRepository portRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedPorts();
    }

    private void seedAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@shipshape.com");
            admin.setRole(UserRole.SYSTEM_ADMIN);
            userRepository.save(admin);
        }
    }

    private void seedPorts() {
        if (portRepository.count() == 0) {
            portRepository.save(new Port(null, "Port of Singapore", "SGSIN", "Singapore"));
            portRepository.save(new Port(null, "Port of Rotterdam", "NLRTM", "Netherlands"));
            portRepository.save(new Port(null, "Port of Shanghai", "CNSHA", "China"));
            portRepository.save(new Port(null, "Port of Los Angeles", "USLAX", "United States"));
            portRepository.save(new Port(null, "Port of Hamburg", "DEHAM", "Germany"));
        }
    }
}
