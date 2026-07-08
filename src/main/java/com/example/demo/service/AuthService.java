package com.example.demo.service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.exception.UnauthorizedException;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDto register(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new BusinessValidationException("Username already exists.");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new BusinessValidationException("Email already exists.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(saved.getUsername(), saved.getRole().name());
        return new AuthResponseDto(token, saved.getUsername(), saved.getRole().name());
    }

    public AuthResponseDto register(RegisterDto registerDto) {
        User user = new User();
        user.setUsername(registerDto.getUsername());
        user.setPassword(registerDto.getPassword());
        user.setEmail(registerDto.getEmail());
        user.setRole(registerDto.getRole());
        return register(user);
    }

    public AuthResponseDto login(AuthRequestDto request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid username or password.");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
        return new AuthResponseDto(token, user.getUsername(), user.getRole().name());
    }
}
