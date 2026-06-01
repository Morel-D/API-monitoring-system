package com.example.backend.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.security.dto.AuthResponse;
import com.example.backend.security.dto.LoginRequest;
import com.example.backend.security.dto.RegisterRequest;
import com.example.backend.security.jwt.JwtService;

// import lombok.RequiredArgsConstructor;

@Service
// @RequiredArgsConstructor
public class AuthService {

    @Autowired
    private  UserService userService;
    private  JwtService jwtService;
    private  PasswordEncoder passwordEncoder;
    private  AuthenticationManager authenticationManager;


    public AuthResponse register(RegisterRequest request) {
        // Create user
        var user = userService.createUser(
            request.getName(),
            request.getEmail(),
            passwordEncoder.encode(request.getPassword())
        );

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

}
