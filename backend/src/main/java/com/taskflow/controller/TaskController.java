package com.taskflow.controller;

import com.taskflow.model.*;
import com.taskflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<Map<String,Object>> getTasks(
            @RequestParam(required = false) Long projectId,
            Authentication auth) {
        User current = userRepository.findByEmail(auth.getName()).orElseThrow();
        List<Task> tasks = projectId != null
            ? taskRepository.findByProjectId(projectId)
            : current.getRole() == User.Role.ADMIN
                ? taskRepository.findAll()
                : taskRepository.findByAssigneeId(current.getId());
        return tasks.stream().map(this::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTask(@PathVariable Long id) {
        return taskRepository.findById(id)
            .map(t -> ResponseEntity.ok(toDto(t)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Map<String,Object> body) {
        Project project = projectRepository.findById(toLong(body.get("projectId"))).orElse(null);
        User assignee = userRepository.findById(toLong(body.get("assigneeId"))).orElse(null);
        if (project == null || assignee == null) return ResponseEntity.badRequest().body("Invalid project or assignee");

        Task task = Task.builder()
            .title((String) body.get("title"))
            .project(project)
            .assignee(assignee)
            .priority(Task.Priority.valueOf(((String) body.getOrDefault("priority", "MEDIUM")).toUpperCase()))
            .status(Task.Status.valueOf(((String) body.getOrDefault("status", "TODO")).toUpperCase()))
            .dueDate(body.get("dueDate") != null ? LocalDate.parse((String) body.get("dueDate")) : null)
            .build();
        taskRepository.save(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Map<String,Object> body) {
        return taskRepository.findById(id).map(t -> {
            if (body.containsKey("title"))      t.setTitle((String) body.get("title"));
            if (body.containsKey("priority"))   t.setPriority(Task.Priority.valueOf(((String) body.get("priority")).toUpperCase()));
            if (body.containsKey("status"))     t.setStatus(Task.Status.valueOf(((String) body.get("status")).toUpperCase()));
            if (body.containsKey("dueDate"))    t.setDueDate(body.get("dueDate") != null ? LocalDate.parse((String) body.get("dueDate")) : null);
            if (body.containsKey("assigneeId")) {
                userRepository.findById(toLong(body.get("assigneeId"))).ifPresent(t::setAssignee);
            }
            taskRepository.save(t);
            return ResponseEntity.ok(toDto(t));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (!taskRepository.existsById(id)) return ResponseEntity.notFound().build();
        taskRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Long toLong(Object val) {
        if (val instanceof Number n) return n.longValue();
        if (val instanceof String s) return Long.parseLong(s);
        return null;
    }

    private Map<String,Object> toDto(Task t) {
        Map<String,Object> assignee = Map.of(
            "id", t.getAssignee().getId(), "name", t.getAssignee().getName(),
            "color", t.getAssignee().getColor(), "email", t.getAssignee().getEmail()
        );
        Map<String,Object> dto = new LinkedHashMap<>();
        dto.put("id",          t.getId());
        dto.put("title",       t.getTitle());
        dto.put("projectId",   t.getProject().getId());
        dto.put("projectName", t.getProject().getName());
        dto.put("assignee",    assignee);
        dto.put("priority",    t.getPriority().name());
        dto.put("status",      t.getStatus().name());
        dto.put("dueDate",     t.getDueDate());
        dto.put("createdAt",   t.getCreatedAt());
        dto.put("updatedAt",   t.getUpdatedAt());
        return dto;
    }
}
