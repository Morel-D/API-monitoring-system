package com.example.backend.security.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.security.dto.AuthResponse;
import com.example.backend.security.dto.LoginRequest;
import com.example.backend.security.dto.RegisterRequest;
import com.example.backend.security.jwt.JwtService;
import com.example.backend.security.model.User;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final  UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;


    public AuthResponse register(RegisterRequest request) {

        if (userService.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email_already_exists");
        }

        if (request.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password_to_week");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());


        var user = userService.createUser(
            request.getName(),
            request.getEmail(),
            encodedPassword
        );

        System.out.println("CREATED USER --> "+ user);

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token, "Bearer");
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        var user = userService.findByEmail(request.getEmail());
        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse(token, "Bearer");
    }

    public User getCurrentUser(String email) {
        return userService.findByEmail(email);
    }
}
