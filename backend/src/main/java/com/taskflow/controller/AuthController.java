package com.taskflow.controller;

import com.taskflow.model.User;
import com.taskflow.repository.UserRepository;
import com.taskflow.security.JwtUtils;
import lombok.*;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto req) {
        return userRepository.findByEmail(req.email())
            .filter(u -> passwordEncoder.matches(req.password(), u.getPassword()))
            .map(u -> {
                String token = jwtUtils.generateToken(u.getEmail());
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", toDto(u)
                ));
            })
            .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto req) {
        if (userRepository.existsByEmail(req.email())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already in use"));
        }
        String[] colors = {"#e8ff5a", "#5a9eff", "#c77dff", "#ffaa3b", "#ff5a6e"};
        var user = User.builder()
            .name(req.name())
            .email(req.email())
            .password(passwordEncoder.encode(req.password()))
            .role("ADMIN".equalsIgnoreCase(req.role()) ? User.Role.ADMIN : User.Role.MEMBER)
            .color(colors[(int)(Math.random() * colors.length)])
            .build();
        userRepository.save(user);
        String token = jwtUtils.generateToken(user.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("token", token, "user", toDto(user)));
    }

    private Map<String,Object> toDto(User u) {
        return Map.of("id", u.getId(), "name", u.getName(), "email", u.getEmail(),
                      "role", u.getRole().name(), "color", u.getColor());
    }

    record LoginDto(String email, String password) {}
    record RegisterDto(String name, String email, String password, String role) {}
}
