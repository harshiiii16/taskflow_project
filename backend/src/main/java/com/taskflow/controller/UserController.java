package com.taskflow.controller;

import com.taskflow.model.User;
import com.taskflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping
    public List<Map<String,Object>> getAllUsers() {
        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
            .map(u -> ResponseEntity.ok(toDto(u)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String,String> body) {
        return userRepository.findById(id).map(u -> {
            u.setRole(User.Role.valueOf(body.get("role").toUpperCase()));
            userRepository.save(u);
            return ResponseEntity.ok(toDto(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Map<String,Object> toDto(User u) {
        return Map.of("id", u.getId(), "name", u.getName(), "email", u.getEmail(),
                      "role", u.getRole().name(), "color", u.getColor());
    }
}
