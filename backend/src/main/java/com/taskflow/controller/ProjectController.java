package com.taskflow.controller;

import com.taskflow.model.*;
import com.taskflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<Map<String,Object>> getProjects(Authentication auth) {
        User current = userRepository.findByEmail(auth.getName()).orElseThrow();
        List<Project> projects = current.getRole() == User.Role.ADMIN
            ? projectRepository.findAll()
            : projectRepository.findByMemberId(current.getId());
        return projects.stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProject(@PathVariable Long id) {
        return projectRepository.findById(id)
            .map(p -> ResponseEntity.ok(toDto(p)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProject(@RequestBody Map<String,String> body, Authentication auth) {
        User creator = userRepository.findByEmail(auth.getName()).orElseThrow();
        Project project = Project.builder()
            .name(body.get("name"))
            .description(body.getOrDefault("description", ""))
            .createdBy(creator)
            .build();
        project.getMembers().add(creator);
        projectRepository.save(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(project));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Map<String,String> body) {
        return projectRepository.findById(id).map(p -> {
            if (body.containsKey("name"))        p.setName(body.get("name"));
            if (body.containsKey("description")) p.setDescription(body.get("description"));
            projectRepository.save(p);
            return ResponseEntity.ok(toDto(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (!projectRepository.existsById(id)) return ResponseEntity.notFound().build();
        projectRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/members/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addMember(@PathVariable Long id, @PathVariable Long userId) {
        Project p = projectRepository.findById(id).orElse(null);
        User u = userRepository.findById(userId).orElse(null);
        if (p == null || u == null) return ResponseEntity.notFound().build();
        p.getMembers().add(u);
        projectRepository.save(p);
        return ResponseEntity.ok(toDto(p));
    }

    private Map<String,Object> toDto(Project p) {
        long done = p.getTasks().stream().filter(t -> t.getStatus() == Task.Status.DONE).count();
        List<Map<String,Object>> members = p.getMembers().stream()
            .map(m -> (Map<String,Object>) Map.of("id", m.getId(), "name", m.getName(),
                        "email", m.getEmail(), "color", m.getColor(), "role", m.getRole().name()))
            .toList();
        return Map.of(
            "id",          p.getId(),
            "name",        p.getName(),
            "description", p.getDescription() != null ? p.getDescription() : "",
            "members",     members,
            "taskCount",   p.getTasks().size(),
            "doneCount",   done,
            "createdAt",   p.getCreatedAt()
        );
    }
}
