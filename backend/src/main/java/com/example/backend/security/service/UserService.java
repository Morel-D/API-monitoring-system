package com.example.backend.security.service;

import com.example.backend.security.model.User;
import com.example.backend.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createUser(String name, String email, String encodedPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("email_already_exist");
        }

        User user = User.builder()
                .name(name)
                .email(email)
                .password(encodedPassword)
                .build();

        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("user_not_found"));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}